import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Subcategory from "./pages/Subcategory";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Sidepage from "./pages/_components/sidepage";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { getUserProfile } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <Sidepage>
              <Home />
            </Sidepage>
          }
        />
        <Route
          path="/category"
          element={
            <Sidepage>
              <Category />
            </Sidepage>
          }
        />
        <Route
          path="/subcategory"
          element={
            <Sidepage>
              <Subcategory />
            </Sidepage>
          }
        />
        <Route
          path="/products"
          element={
            <Sidepage>
              <Products />
            </Sidepage>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
