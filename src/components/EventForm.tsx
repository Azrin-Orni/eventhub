import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { db, auth } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

interface EventFormInputs {
  title: string;
  description: string;
  date: string;
  location: string;
}

const EventForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormInputs>();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    try {
      if (!auth.currentUser) {
        setError("You must be logged in to create an event");
        return;
      }
      await addDoc(collection(db, "events"), {
        ...data,
        organizerId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
      });
      setSuccess("Event created successfully");
      reset();
    } catch (err) {
      setError("Failed to create event");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text 2xl font-bold mb-4">Create Event</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {/* title */}
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
        {/* description */}
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
        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            {...register("location", { required: "Location is required" })}
            className="w-full p-2 boreder rounded"
            type="text"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>
        {/* submit button */}
        <button
          type="submit"
          className="w-full bg-slate-500 text-white p-2 rounded hover:bg-gray-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
