import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
 import "react-markdown-editor-lite/lib/index.css";

export default function Blog({
  _id,
  title: existingTitle,
  slug: existingSlug,
  blogcategory: existingBlogCategory,
  description: existingdescription,
  tags: existingTags,
  status: existingStatus,
}) {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || "");
  const [slug, setslug] = useState(existingSlug || "");
  const [blogcategory, setBlogcategory] = useState(existingBlogCategory || "");
  const [description, setDescription] = useState(existingdescription || "");
  const [tags, setTags] = useState(existingTags || "");
  const [status, setStatus] = useState(existingStatus || "");

  async function createProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      slug,
      blogcategory,
      description,
      tags,
      status,
    };
    if (_id) {
      await axios.put("/api/blogapi", { ...data, _id });
    } else {
      await axios.post("/api/blogapi", data);
    }
    setRedirect(true);
  }

  if (redirect) {
    router.push("/");
    return null;
  }

  return (
    <>
      <from onSubmit={createProduct} className="addWebsiteform">
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter small title"
          />
        </div>

        {/* blog slug */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setslug(e.target.value)}
            placeholder="Enter Slug url"
            required
          />
        </div>

        {/* blog category */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={blogcategory}
            onChange={(e) =>
              setBlogcategory(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            multiple
          >
            <option value="htmlcssjs">Html, css & JavaScript</option>
            <option value="nextjs">Next Js, React Js</option>
            <option value="database">Database</option>
            <option value="deployment">Deployment</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            selected: <span>Category</span>
          </p>
        </div>
        {/* markdown description content */}
        <div className="description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="description">Blog Content</label>
          <MarkdownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: "100%", height: "400px" }} // you can adjust the height as your device needed
            renderHTML={(text) => (
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    if (inline) {
                      return <code>{children}</code>;
                    } else if (match) {
                      return (
                        <div style={{ position: "relative" }}>
                          <pre
                            style={{
                              padding: "0",
                              borderRadius: "5px",
                              overflow: "auto",
                              whiteSpace: "pre-wrap",
                            }}
                            {...props}
                          >
                            <code>{children}</code>
                          </pre>
                          <button style={{position:'absolute', top: '0', right: '0', zIndex: '1' }}
                          onClick={() => navigator.clipboard.writeText(children)}
                          >copy code</button>
                        </div>
                      );
                      } else {
                        return <code {...props}>{children}</code>;
                    }
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          />
        </div>
        {/* tags */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="tags">Tags</label>
          <select
            name="tags"
            id="tags"
            value={tags}
            onChange={(e) =>
              setTags(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            multiple
          >
            <option value="html">Htmlt</option>
            <option value="css">Css</option>
            <option value="javascript">Javascript</option>
            <option value="nextjs">NextJs</option>
            <option value="reactjs">ReactJs</option>
            <option value="database">Database</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            selected: <span>Tags</span>
          </p>
        </div>
        {/*  status */}
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            id="status"
          >
            <option value="">No Select</option>
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
          <p className="existingcategory flex gap-1 mt-1 mb-1">
            selected: <span>Status</span>
          </p>
        </div>
        {/* save Button */}
        <div className="w-100 mb-2">
          <button type="submit" className="w-100 addwebbtn flex-center">
            SAVE BLOG
          </button>
        </div>
      </from>
    </>
  );
}
