import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-slate-800 font-semibold text-2xl">Events</h1>
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="border rounded p-4 bg-white shadow">
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

export default EventList;
