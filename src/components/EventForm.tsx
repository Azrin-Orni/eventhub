import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { db, auth, storage } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface EventFormInputs {
  title: string;
  description: string;
  date: string;
  location: string;
  image?: FileList;
}

interface EventFormProps {
  onEventCreated?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onEventCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormInputs>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    setError("");
    setSuccess("");
    try {
      // console.log("Current user:", auth.currentUser?.uid);
      if (!auth.currentUser) {
        setError("You must be logged in to create an event.");
        return;
      }

      let imageUrl = "";
      if (data.image && data.image.length > 0 && data.image[0]) {
        console.log(
          "Uploading image:",
          data.image[0].name,
          "type:",
          data.image[0].type
        );
        if (!data.image[0].type.startsWith("image/")) {
          setError("Please select a valid image file (e.g., JPG, PNG).");
          return;
        }
        const imageRef = ref(
          storage,
          `events/${auth.currentUser.uid}/${data.image[0].name}`
        );
        console.log("Uploading to Storage path:", imageRef.fullPath);
        await uploadBytes(imageRef, data.image[0]);
        imageUrl = await getDownloadURL(imageRef);
        console.log("Image uploaded, URL:", imageUrl);
      }

      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        imageUrl,
        organizerId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
      };
      // console.log("Creating event with data:", eventData);
      await addDoc(collection(db, "events"), eventData);
      setSuccess("Event created successfully!");
      reset();
      if (onEventCreated) {
        onEventCreated(); // Notify parent
      }
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(`Failed to create event: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
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
            type="date"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            {...register("location", { required: "Location is required" })}
            className="w-full p-2 border rounded"
            type="text"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Image (Optional)</label>
          <input
            {...register("image")}
            className="w-full p-2 border rounded"
            type="file"
            accept="image/*"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
