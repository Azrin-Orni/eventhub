import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"attendee" | "organizer">("attendee");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
      });
      navigate("/events");
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "attendee" | "organizer")
            }
            className="w-full p-2 border rounded"
          >
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-slate-500 text-white p-2 rounded hover:bg-slate-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
