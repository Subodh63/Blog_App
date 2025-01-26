import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BsPostcard } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import useFetchData from "@/hooks/useFetchData";
import Dataloading from "@/components/Dataloading";

export default function blogs() {

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(4);
  
    // Fetch blogs from API endpoint with hooks
    const apiEndpoint = "/api/blogapi";
    const [alldata, loading] = useFetchData(apiEndpoint);
  
    // Log data to check if it's fetched correctly
    useEffect(() => {
      console.log("Fetched Data:", alldata);
    }, [alldata]);
  
    // Function to handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    // Ensure alldata is always an array
    const allBlogCount = Array.isArray(alldata) ? alldata.length : 0;
  
    const indexOfLastBlog = currentPage * perPage;
    const indexOfFirstBlog = indexOfLastBlog - perPage;
    const currentBlogs = Array.isArray(alldata) ? alldata.slice(indexOfFirstBlog, indexOfLastBlog) : [];
  
    // Filtering the Publish blogs
    const publishedBlogs = alldata.filter((ab) => ab.status === "publish");
  
    // console.log("Publish Blogs:", publishedBlogs); // Log filtered publish blogs
  
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allBlogCount / perPage); i++) {
      pageNumbers.push(i);
    }

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
              <tbody>
              {loading ? (
                  <tr>
                    <td>
                      <Dataloading />
                    </td>
                  </tr>
                ) : (
                  <>
                    {publishedBlogs.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No published Blogs 
                        </td>
                      </tr>
                    ) : (
                      publishedBlogs.map((blog, index) => (
                        <tr key={blog._id}>
                          <td>{indexOfFirstBlog +index + 1}</td>
                          <td>
                            <h3>{blog.title}</h3>
                          </td>
                          <td>
                            <pre>{blog.slug}</pre>
                          </td>
                          <td>
                          <div className="flex gap-2 flex-center">
                      <Link href={'/blogs/edit/' + blog._id}>
                        <button title="edit">
                          <FaEdit />
                        </button>
                      </Link>
                      <Link href={'/blogs/delete/' + blog._id}>
                        <button title="delete">
                          <RiDeleteBin6Fill />
                        </button>
                      </Link>
                    </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </>
                )}
              </tbody>
            </table>
            {/* pagination pending start after database add... */}
            {publishedBlogs.length > 0 && (
              <div className="blogpagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
          
                >
                  Previous
                </button>
                {pageNumbers
                  .slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, pageNumbers.length))
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`${currentPage === number ? "active" : ""}`}
                    >
                      {number}
                    </button>
                  ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentBlogs.length < perPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
