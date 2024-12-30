import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BsPostcard } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function blogs() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
      // check if there's no active session and redirect to login page
      if (!session) {
        router.push('/login');
      }
    }, [session, router]);

  if (status === "loading") {
    // loading state, loader or any other indicator
    return (
      <div className="loadingdata flex flex-col flex-center wh_100">
        <Loading />
        <h1>Loading...</h1>
      </div>
    );
  }
  if (session) {
    return (
      <>
        <div className="blogpage">
          <div className="titledashboard flex flex-sb">
            <div>
              <h2>
                All Published <span>Blogs</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="breadcrumb">
              <BsPostcard /> <span>/</span> <span>Blogs</span>
            </div>
          </div>
          <div className="blogstable">
            <div className="flex gap-2 mb-1">
              <h2>Search Blogs:</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tittle..."
              />
            </div>

            <table className="table table-styling">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Edit / Delete</th>
                </tr>
              </thead>
              <thead>
                <tr>
                  <td>1</td>
                  <td>tittle of the blog</td>
                  <td>slug of the blog</td>
                  <td>
                    <div className="flex gap-2 flex-center">
                      <Link href="/blogs/edit/id">
                        <button title="edit">
                          <FaEdit />
                        </button>
                      </Link>
                      <Link href="/blogs/edit/id">
                        <button title="edit">
                          <RiDeleteBin6Fill />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              </thead>
            </table>
            {/* pagination pending start after database add... */}
          </div>
        </div>
      </>
    );
  }
}
