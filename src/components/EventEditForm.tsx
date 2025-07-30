import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface EventFormInputs {
  title: string;
  description: string;
  date: string;
  location: string;
}

interface EventEditFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
  };
  onClose: () => void;
}

const EventEditForm: React.FC<EventEditFormProps> = ({ event, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormInputs>({
    defaultValues: {
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    try {
      await updateDoc(doc(db, "events", event.id), { ...data });
      setSuccess("Event updated suceessfully!");
      setTimeout(onClose, 1000);
    } catch (err) {
      setError("Failed to update event");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded"
            type="text"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full p-2 border rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            {...register("date", { required: "Date is required" })}
            className="w-full p-2 border rounded"
            type="text"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            {...register("location", { required: "Location is required" })}
            className="w-full p-2 border rounder"
            type="text"
          />
          {errors.location && (
            <p className="text-red-500 text-sm"> {errors.location.message}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="w-full bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
          >
            Update Event
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEditForm;
