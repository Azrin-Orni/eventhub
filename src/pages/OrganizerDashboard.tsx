import React from "react";
import EventForm from "../components/EventForm";

const OrganizerDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-slate-800 font-semibold text-2xl">
        Organizer Dashboard
      </h1>

      <EventForm />
    </div>
  );
};

export default OrganizerDashboard;
