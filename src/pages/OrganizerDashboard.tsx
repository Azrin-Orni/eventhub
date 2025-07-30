import React, { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import EventForm from "../components/EventForm";
import EventEditForm from "../components/EventEditForm";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
}

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!auth.currentUser) return;
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Event))
          .filter((event) => event.organizerId === auth.currentUser!.uid);
        setEvents(eventData);
      } catch (err) {
        console.log("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-slate-800 font-semibold text-2xl">
        Organizer Dashboard
      </h1>

      {editingEvent ? (
        <EventEditForm
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      ) : (
        <>
          <EventForm />
          <h2 className="text-xl font-semibold mt-8 mb-4">Your Events</h2>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded p-4 bg-white shadow"
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                  <p className="text-sm">Date: {event.date}</p>
                  <p className="text-sm">Location: {event.location}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="bg-cyan-900 text-white p-2 rounded hover:bg-cyan-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-800 text-white p-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrganizerDashboard;
