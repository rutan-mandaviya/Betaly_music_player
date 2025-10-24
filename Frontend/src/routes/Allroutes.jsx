import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Loader } from "../components/Loader"; // optional spinner
import Lenis from "@studio-freight/lenis";

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Artistdashboard = lazy(() => import("../pages/Artistdashboard"));
const Music = lazy(() => import("../pages/Music"));
const Playlist = lazy(() => import("../pages/Playlist"));
const Profile = lazy(() => import("../pages/Profile"));

const Allroutes = () => {
  // Lenis smooth scrolling

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/musics/:musicId" element={<Music />} />
        <Route path="/playlist/:playlistId" element={<Playlist />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artist/dashboard"
          element={
            <ProtectedRoute role="artist">
              <Artistdashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default Allroutes;
