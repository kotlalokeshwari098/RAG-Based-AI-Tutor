import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import ChatUI from "./pages/ChatUI";

const routes=createBrowserRouter(
  createRoutesFromElements(
      <Route path="/">
         <Route index element={<Home />}/>
         <Route path='/upload' element={<Upload />}/>
         <Route path='/chat/:id' element={<ChatUI />}/>
      </Route>
  )
)

const App = () => {
  return (
    <div>
        <RouterProvider router={routes} />
    </div>
  )
}

export default App