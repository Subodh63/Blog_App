import Blog from "@/components/Blog";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading"; // Assuming you have a Loading component
import { BsPostcard } from "react-icons/bs"; // Ensure this import exists

export default function Deleteblog() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      axios.get("/api/blogapi?id=" + id).then((response) => {
        setProductInfo(response.data);
      });
    }
  }, [id]);

  const goback = () => {
    router.push("/");
  };

  const deleteOneblog = async () => {
    try {
      await axios.delete("/api/blogapi?id=" + id);
      goback();
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Head>
        <title>Delete Blog</title>
      </Head>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Delete <span>{productInfo?.title || "Blog"}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <BsPostcard /> <span>/</span> <span>Delete Blog</span>
          </div>
        </div>
        <div className="deletesec flex flex-center wh_100">
          <div className="deletecard">
            <svg
              viewBox="0 0 24 24"
              fill="red"
              height="6em"
              width="6em"
              aria-label="Delete Icon"
            >
              <path d="M3 6l3 16.2C6.1 22.8 6.6 23 7 23h10c.4 0 .9-.2 1-.8L21 6H3zm5.5 2H9v10h1.5V8zm4.5 0h-1.5v10H13V8zM15 1h-6v2H4v2h16V3h-5V1z" />
            </svg>
            <p className="cookieHeading">Are you sure?</p>
            <p className="cookieDescription">If you delete this blog, it will be gone forever.</p>                                          
            <div className="buttonContainer">
                <button onClick={deleteOneblog} className="acceptButton">Delete</button>
                <button onClick={goback} className="declineButton">Cancel</button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
