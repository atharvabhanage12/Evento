import EventCategory from '@/components/EventCategory'
import HeroSection from '@/components/HeroSection'
import { Separator } from "@/components/ui/separator"

const events = [
  {
    id: 1,
    name: 'Coldplay Concert',
    date: '2023-12-15',
    category: 'Music',
    image: 'https://www.hindustantimes.com/ht-img/img/2024/09/19/1600x900/MUSIC-COLDPLAY--0_1700663190034_1726733066717.JPG'
  },
  {
    id: 2,
    name: 'Diljit Dosanjh Live',
    date: '2023-11-30',
    category: 'Music',
    image: 'https://www.financialexpress.com/wp-content/uploads/2024/09/Diljit-Dosanjh.jpg'
  },
  {
    id: 3,
    name: 'Stand-up Comedy Night',
    date: '2023-12-05',
    category: 'Comedy',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYqQ6OzR0Z93a6B-wpL7BeihL6m-t0j9vx3A&s'
  },
  {
    id: 4,
    name: 'Local Theater Play',
    date: '2023-12-10',
    category: 'Theater',
    image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Palais_Garnier._December_5%2C_2010.jpg"
  },
  {
    id: 5,
    name: 'EDM Festival',
    date: '2024-01-15',
    category: 'Music',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4vvBqiYGLZrJbrPwePd1PjmQFuLXt44Rmrw&s'
  },
  {
    id: 6,
    name: 'Improv Show',
    date: '2023-12-20',
    category: 'Comedy',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeVlrIvJ53ZKGJHJIw8E3rYnmxNO3luwLemw&s'
  }
]

const categories = Array.from(new Set(events.map(event => event.category)))

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <HeroSection />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Discover Amazing Events</h2>
        <Separator className="my-8" />
        {categories.map(category => (
          <EventCategory 
            key={category} 
            category={category} 
            events={events.filter(event => event.category === category)}
          />
        ))}
      </main>
    </div>
  )
}

