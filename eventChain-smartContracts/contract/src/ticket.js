import { Far } from '@endo/far';
import { M, getCopyBagEntries, makeCopyBag } from '@endo/patterns';
import { AssetKind } from '@agoric/ertp/src/amountMath.js';
import { atomicRearrange } from '@agoric/zoe/src/contractSupport/atomicTransfer.js';
import { AmountMath, AmountShape } from '@agoric/ertp';

/**
 * @import {Amount, NatValue, Brand} from '@agoric/ertp/src/types.js';
 */
const { Fail, quote: q } = assert;

// #region bag utilities
/**
 *
 * @param {Amount} amount
 * @param {number} n
 * @returns {Amount}
 */
const multiply = (amount, n) => {
  const arr = Array.from({ length: n });
  return arr.reduce(
    (sum, _) => AmountMath.add(amount, sum),
    AmountMath.make(amount.brand, 0n),
  );
};

/**
 *
 * @param {Amount} sum
 * @param {[string, bigint]} entry
 * @param {Inventory} inventory
 * @returns {Amount}
 */
const addMultiples = (sum, entry, inventory) => {
  const multiple = multiply(inventory[entry[0]].tradePrice, Number(entry[1]));
  return AmountMath.add(multiple, sum);
};

/**
 *
 * @param {import('@endo/patterns').CopyBag} bag
 * @param {Inventory} inventory
 * @returns {Amount}
 */
export const bagPrice = (bag, inventory) => {
  const entries = /** @type {[string, bigint][]} */ (getCopyBagEntries(bag));
  const values = Object.values(inventory);
  const brand = values[0].tradePrice.brand;
  let finalAmount = /** @type {Amount} */ (AmountMath.makeEmpty(brand));
  for (const entry of entries) {
    finalAmount = addMultiples(finalAmount, entry, inventory);
  }
  return finalAmount;
};
harden(bagPrice);
// #endregion

/**
 * Inventory contains price and maximum for each type of tickets
 * @example
 * {
 *   frontRow: {
 *     tradePrice: AmountMath.make(istBrand, 3n),
 *     maxTickets: 3n,
 *   },
 * }
 *
 * @typedef {{[key: string]: {tradePrice: {brand: Brand<"copyBag">, value: any}, maxTickets: NatValue}}} Inventory
 */
const InventoryShape = M.recordOf(M.string(), {
  tradePrice: AmountShape,
  maxTickets: M.nat(),
});

/**
 * In addition to the standard `issuers` and `brands` terms,
 * this contract is parameterized by terms for inventory
 *
 * @typedef {{
 *   inventory: Inventory
 * }} SellConcertTicketsTerms
 */

export const meta = harden({
  customTermsShape: { inventory: InventoryShape },
});
harden(meta);
// compatibility with an earlier contract metadata API
export const customTermsShape = meta.customTermsShape;
harden(customTermsShape);

/**
 * Start a contract that
 *   - creates a new semi-fungible asset type for Tickets, and
 *   - handles offers to buy as many tickets as inventory allows
 *
 * @param {ZCF<SellConcertTicketsTerms>} zcf
 */
export const start = async zcf => {
  const walletTicketPurchases = new Map();
  const balance = new Map();

  const { inventory } = zcf.getTerms();
//const name = brand.getAllegedName();
// values[0].tradePrice.brand;

  const inventoryValues = Object.values(inventory);

  // make sure inventory is not empty
  inventoryValues.length > 0 || Fail`inventory must not be empty`;
  // make sure all kinds of tickets have the same brand for tradePrice
  inventoryValues.every(
    v => v.tradePrice.brand === inventoryValues[0].tradePrice.brand,
  ) || Fail`inventory must have the same brand for all tickets' tradePrice`;

  /**
   * a new ERTP mint for tickets, accessed thru the Zoe Contract Facet.
   * Note: `makeZCFMint` makes the associated brand and issuer available
   * in the contract's terms.
   *
   * AssetKind.COPY_BAG can express non-fungible (or rather: semi-fungible)
   * amounts such as: 3 frontRow tickets and 1 middleRow ticket.
   */
  const ticketMint = await zcf.makeZCFMint('Ticket', AssetKind.COPY_BAG);
  const { brand: ticketBrand } = ticketMint.getIssuerRecord();

  const inventoryBag = makeCopyBag(
    Object.entries(inventory).map(([ticket, { maxTickets }], _i) => [
      ticket,
      maxTickets,
    ]),
  );
  const toMint = {
    Tickets: {
      brand: ticketBrand,
      expired: false,
      value: inventoryBag,
    },
  };
  /**
   * Mint the whole inventory at contract start time, this also allows us to
   * check if user is buying more than our inventory allows using
   * `AmountMath.GTE` function
   */
  const inventorySeat = ticketMint.mintGains(toMint);

  /**
   * a pattern to constrain proposals given to {@link tradeHandler}
   *
   * The `Price` amount must be AmountShape.
   * The `Tickets` amount must use the `Ticket` brand and a bag value.
   */
  const proposalShape = harden({
    give: { Price: AmountShape },
    want: { Tickets: { brand: ticketBrand, value: M.bag() } },
    exit: M.any(),
  });

  /** a seat for allocating proceeds of sales */
  const proceeds = zcf.makeEmptySeatKit().zcfSeat;

  /** @type {OfferHandler} */
  const tradeHandler = buyerSeat => {
    // give and want are guaranteed by Zoe to match proposalShape
    const { give, want } = buyerSeat.getProposal();

    // check that we have enough inventory
    AmountMath.isGTE(
      inventorySeat.getCurrentAllocation().Tickets,
      want.Tickets,
    ) || Fail`Not enough inventory, ${q(want.Tickets)} wanted`;

    // check that user is paying enough for all the tickets
    const totalPrice = bagPrice(want.Tickets.value, inventory);
    const actualPrice = BigInt(Number(totalPrice)*1.1);
    
    AmountMath.isGTE(give.Price, AmountMath.make(ticketBrand, actualPrice) ||
      Fail`Total price is ${q(totalPrice)}, but ${q(give.Price)} was given`);

    atomicRearrange(
      zcf,
      harden([
        // price from buyer to proceeds
        [buyerSeat, proceeds, { Price: AmountMath.make(ticketBrand, actualPrice) }],
        // tickets from inventory to buyer
        [inventorySeat, buyerSeat, want],
      ]),
    );

    const buyerWallet = buyerSeat.getSubscriber();
    balance.set(buyerWallet, actualPrice-BigInt(Number(totalPrice)));
    const existingTickets = walletTicketPurchases.get(buyerWallet) || [];
    const purchaseEntry = {
      tickets: want.Tickets,
      purchaseTimestamp: Date.now(),
      expiry: false,
    };
    
    walletTicketPurchases.set(buyerWallet, [
        ...existingTickets,
        purchaseEntry,
      ]);
  

    buyerSeat.exit(true);
    return 'trade complete';
  };

  const verify = walletAddress => {
    return walletTicketPurchases.get(walletAddress) || [];
  }

  const buyFromBalance = (buyerWallet, amount) => {
    const oldBalance = balance.get(buyerWallet);
    if(oldBalance>amount){
        balance.set(buyerWallet, oldBalance-amount);
    }else{
        Fail`Total price is ${q(amount)}, but remaining balance is ${q(oldBalance)}`;
    }
  }

  const getBalance = buyerWallet => {
    return balance.get(buyerWallet)
  }


  /**
   * Make an invitation to trade for tickets.
   *
   * Proposal Keywords used in offers using these invitations:
   *   - give: `Price`
   *   - want: `Tickets`
   */
  const makeTradeInvitation = () =>
    zcf.makeInvitation(tradeHandler, 'buy tickets', undefined, proposalShape);

  // Mark the publicFacet Far, i.e. reachable from outside the contract
  const publicFacet = Far('Tickets Public Facet', {
    makeTradeInvitation,
    verify,
    getBalance,
    buyFromBalance,

  });

  return harden({ publicFacet });
};
harden(start);