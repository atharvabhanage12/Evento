import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:local_auth/local_auth.dart';
import 'package:qr_code_scanner_plus/qr_code_scanner_plus.dart';
import 'package:camera/camera.dart';
import 'dart:convert';

late List<CameraDescription> cameras;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  cameras = await availableCameras();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  ThemeMode _themeMode = ThemeMode.system;

  void _toggleTheme() {
    setState(() {
      _themeMode =
          _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Evento',
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: Colors.blueGrey[900],
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.blueGrey,
          foregroundColor: Colors.white,
        ),
        scaffoldBackgroundColor: Colors.white,
        textTheme: const TextTheme(bodyMedium: TextStyle(color: Colors.black)),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.black,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.black,
          foregroundColor: Colors.white,
        ),
        scaffoldBackgroundColor: Colors.black,
        textTheme: const TextTheme(bodyMedium: TextStyle(color: Colors.white)),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: Colors.blueGrey,
        ),
      ),
      themeMode: _themeMode,
      home: AuthenticationPage(onThemeToggle: _toggleTheme),
    );
  }
}

class AuthenticationPage extends StatelessWidget {
  final VoidCallback onThemeToggle;

  const AuthenticationPage({super.key, required this.onThemeToggle});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            icon: const Icon(Icons.brightness_6),
            onPressed: onThemeToggle,
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(image: AssetImage("assets/images/BG.jpg"),fit: BoxFit.cover)
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text("Evento",style: GoogleFonts.orbitron(letterSpacing: 2.0,fontSize: 32, fontWeight: FontWeight.w400),),
            const SizedBox(height: 50.0,),
            Center(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                  backgroundColor: const Color.fromARGB(104, 67, 15, 76),
                  textStyle: const TextStyle(
                  fontSize: 18,
                  fontFamily: "Roboto",
                  fontWeight: FontWeight.w300),),
                onPressed: () => _authenticate(context),
                child: const Text("Authenticate with Face ID or Fingerprint"),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _authenticate(BuildContext context) async {
    final auth = LocalAuthentication();
    try {
      final canAuthenticateWithBiometrics = await auth.canCheckBiometrics;
      final isDeviceSupported = await auth.isDeviceSupported();

      if (!canAuthenticateWithBiometrics && !isDeviceSupported) {
        _showSnackBar(context, "Biometric authentication is not supported.");
        return;
      }

      final authenticated = await auth.authenticate(
        localizedReason: "Authenticate to access QR Scanner",
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true, 
        ),
      );

      if (authenticated) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const QRScannerPage()),
        );
      } else {
        _showSnackBar(context, "Authentication failed. Please try again.");
      }
    } catch (e) {
      _showSnackBar(context, "Authentication error: $e");
    }
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }
}

class QRScannerPage extends StatefulWidget {
  const QRScannerPage({super.key});

  @override
  State<QRScannerPage> createState() => _QRScannerPageState();
}

// class _QRScannerPageState extends State<QRScannerPage> {
//   final GlobalKey qrKey = GlobalKey();
//   QRViewController? controller;
//   String? qrData;
//   bool isScanned = false;

//   @override
//   void dispose() {
//     controller?.dispose();
//     super.dispose();
//   }

//   void _onQRViewCreated(QRViewController controller) {
//     this.controller = controller;
//     controller.scannedDataStream.listen((scanData) {
//       if (!isScanned) {
//         setState(() {
//           qrData = scanData.code;
//           isScanned = true;
//         });
//         _showSuccessAnimation();
//       }
//     });
//   }

//   void _showSuccessAnimation() {
//     showDialog(
//       context: context,
//       builder: (context) {
//         return Center(
//           child: Container(
//             width: 250,
//             height: 250,
//             decoration: BoxDecoration(
//               color: Colors.black.withOpacity(0.9),
//               borderRadius: BorderRadius.circular(16),
//             ),
//             child: const Column(
//               mainAxisAlignment: MainAxisAlignment.center,
//               crossAxisAlignment: CrossAxisAlignment.center,
//               children: [
//                 Icon(Icons.check_circle, color: Colors.green, size: 100),
//                 SizedBox(height: 10),
//                 Center(
//                   child: Text(
//                     'Scanned Successfully!',
//                     style: TextStyle(color: Colors.white, fontSize: 16),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         );
//       },
//     );

//     Future.delayed(const Duration(seconds: 2), () {
//       Navigator.of(context).pop(); 
//       Navigator.of(context).push(
//         MaterialPageRoute(
//           builder: (context) => QRDataPage(data: qrData ?? 'No Data Found'),
//         ),
//       );
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('QR Code Scanner'),
//       ),
//       body: QRView(
//         key: qrKey,
//         onQRViewCreated: _onQRViewCreated,
//         overlay: QrScannerOverlayShape(
//           borderColor: Colors.green,
//           borderRadius: 10,
//           borderLength: 20,
//           borderWidth: 10,
//           cutOutSize: MediaQuery.of(context).size.width * 0.8,
//         ),
//       ),
//     );
//   }
// }

class _QRScannerPageState extends State<QRScannerPage> {
  final GlobalKey qrKey = GlobalKey();
  QRViewController? controller;
  String? qrData;
  bool isScanned = false;

  static const targetString = 'agoric1rwwley550k9mmk6uq6mm6z4udrg8kyuyvfszjk';

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      if (!isScanned) {
        setState(() {
          qrData = scanData.code;
          isScanned = true;
        });
        _processQRData(qrData!);
      }
    });
  }

  void _processQRData(String data) {
    try {
      final qrJson = jsonDecode(data) as Map<String, dynamic>;

      final containsTarget = qrJson.values.contains(targetString);

      _showResultDialog(containsTarget);
    } catch (e) {
      _showResultDialog(false);
    }
  }

  void _showResultDialog(bool isSuccess) {
    showDialog(
      context: context,
      builder: (context) {
        return Center(
          child: Container(
            width: 250,
            height: 250,
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.9),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(
                  isSuccess ? Icons.check_circle : Icons.error,
                  color: isSuccess ? Colors.green : Colors.red,
                  size: 100,
                ),
                const SizedBox(height: 10),
                Text(
                  isSuccess
                      ? 'Scanned Successfully!\nValid QR Code.'
                      : 'Scan Failed!\nInvalid QR Code.',
                  style: const TextStyle(color: Colors.white, fontSize: 18, decoration: TextDecoration.none,),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );

    Future.delayed(const Duration(seconds: 5), () {
      Navigator.of(context).pop();
      if (isSuccess) {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => QRDataPage(data: qrData ?? 'No Data Found'),
          ),
        );
      } else {
        setState(() {
          isScanned = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Scanner'),
      ),
      body: QRView(
        key: qrKey,
        onQRViewCreated: _onQRViewCreated,
        overlay: QrScannerOverlayShape(
          borderColor: Colors.green,
          borderRadius: 10,
          borderLength: 20,
          borderWidth: 10,
          cutOutSize: MediaQuery.of(context).size.width * 0.8,
        ),
      ),
    );
  }
}


class QRDataPage extends StatefulWidget {
  final String data;

  QRDataPage({super.key, required this.data});

  @override
  State<QRDataPage> createState() => _QRDataPageState();
}

class _QRDataPageState extends State<QRDataPage> {
  final List<String> items = List.generate(10, (index) => 'QR Data ${index + 1}');
  String? selectedQR;
  final List<String> scannedQRHistory = [];
  @override
  Widget build(BuildContext context) {
    var items = [widget.data];
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Data'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: const Color(0xFF1E1E1E),
        leading: selectedQR != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                onPressed: () {
                  setState(() {
                    selectedQR = null; 
                  });
                },
              )
            : null,
      ),
      body:  selectedQR == null
          ? Padding(
              padding: const EdgeInsets.all(8.0),
              child: ListView.builder(
                itemCount: items.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E1E1E),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.5),
                            blurRadius: 6,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ListTile(
                        title: Text(
                          items[index],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        trailing: const Icon(
                          Icons.qr_code,
                          color: Colors.white70,
                        ),
                        onTap: () {
                          setState(() {
                            selectedQR = items[index];
                            if (!scannedQRHistory.contains(items[index])) {
                              scannedQRHistory.add(items[index]);
                            }
                          });
                        },
                      ),
                    ),
                  );
                },
              ),
            )
          : Column(
              children: [
                Expanded(
                  flex: 2,
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.qr_code,
                          size: 120,
                          color: Colors.white70,
                        ),
                        const SizedBox(height: 20),
                        Text(
                          selectedQR!,
                          style: const TextStyle(
                            fontSize: 24,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const Divider(color: Colors.white54),
                Expanded(
                  flex: 3,
                  child: ListView.builder(
                    itemCount: scannedQRHistory.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                        child: Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E1E1E),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: ListTile(
                            title: Text(
                              scannedQRHistory[index],
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                              ),
                            ),
                            leading: const Icon(
                              Icons.history,
                              color: Colors.white70,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }
}
