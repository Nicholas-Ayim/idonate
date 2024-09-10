import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
   <>
   <div className="flex h-[100vh] w-[100%]">
<p>Page Not Found</p>
<Link to="/">Go Homepage</Link>
   </div>
   </>
  )
}
