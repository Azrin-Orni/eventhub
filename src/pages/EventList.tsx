import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

const EventList: React.FC = () => {
  const { user, role } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<{ [key: string]: string }>(
    {}
  );
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(eventData);
      } catch (err) {
        console.error("Error fetching events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleBookEvent = async (eventId: string) => {
    if (!user) {
      setBookingStatus({
        ...bookingStatus,
        [eventId]: "Please log in to book",
      });
      return;
    }
    if (role !== "attendee") {
      setBookingStatus({
        ...bookingStatus,
        [eventId]: "Only attendee can book events",
      });
      return;
    }
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        eventId,
        createdAt: new Date().toISOString(),
      });
      setBookingStatus({ ...bookingStatus, [eventId]: "Booked Sucessfully!" });
    } catch (err) {
      setBookingStatus({ ...bookingStatus, [eventId]: "Failed to book event" });
    }
  };

  const filteredEvents = events.filter((event) =>
    event.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-slate-800 font-semibold text-2xl">Events</h1>
      <div className="mb-4">
        <label className="block text-slate-sm font-medium">
          Filter By Location
        </label>
        <input
          type="text"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter location..."
        />
      </div>
      {filteredEvents.length === 0 ? (
        <p>No events found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="border rounded p-4 bg-white shadow">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm">Date: {event.date}</p>
              <p className="text-sm">Location: {event.location}</p>
              <button
                onClick={() => handleBookEvent(event.id)}
                className="bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
                disabled={bookingStatus[event.id]?.includes("successfully")}
              >
                {bookingStatus[event.id]?.includes("successfully")
                  ? "Booked"
                  : "Book Event"}
              </button>
              {bookingStatus[event.id] && (
                <p className="mt-2 text-sm ${bookingStatus[event.id].includes('successfully')?'text-green-500':'text-red-500'">
                  {bookingStatus[event.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
