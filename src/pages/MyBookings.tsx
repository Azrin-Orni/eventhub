import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface Booking {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingsAndEvents = async () => {
      if (!user) return;

      try {
        //fetch all bookings
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        setBookings(bookingsData);

        //fetch all events

        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventData = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(eventData);
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingsAndEvents();
  }, [user]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        Please logon to view your bookings
      </div>
    );
  }

  const bookedEvents = events.filter((event) =>
    bookings.some((booking) => booking.eventId === event.id)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookedEvents.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookedEvents.map((event) => (
            <div key={event.id} className="border rounded p-4 bg-white shadow">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm">Date: {event.date}</p>
              <p className="text-sm">Location: {event.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyBookings;
