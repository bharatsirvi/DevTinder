import Body from "./components/Body";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import store from "./utils/store";
import Feed from "./components/Feed";
import Main from "./components/Main";
import Signup from "./components/Signup";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Main />}>
              <Route path="/" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
