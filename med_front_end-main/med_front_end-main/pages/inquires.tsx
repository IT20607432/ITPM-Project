import { useEffect, useState } from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import SuperTokensReact from "supertokens-auth-react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { Badge, Input, Modal, Textarea } from "@mantine/core";
import { useRouter } from "next/navigation";

interface ILink {
  name: string;
  onClick: () => void;
  icon: string;
}

function ProtectedPage() {
  const session: any = useSessionContext();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState<any>();

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [commentTitle, setCommentTitle] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const [comments, setComments] = useState<any[]>([]);

  const [isOpened, setIsOpened] = useState(false);
  const [isComments, setIsComments] = useState(false);

  const [postId, setPostId] = useState(null);

  if (session.loading === true) {
    return null;
  }

  useEffect(() => {
    fetchPosts();
    getComments();
  }, []);

  console.log("session contenxt", session);

  async function logoutClicked() {
    await SessionReact.signOut();
    SuperTokensReact.redirectToAuth();
  }

  async function fetchPosts() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/posts`
    );
    if (res.status === 200) {
      const json = await res.json();
      setPosts(json);
    }
  }

  async function getComments() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/`
    );
    if (res.status === 200) {
      const json = await res.json();
      setComments(json);
    }
  }

  const commentData = {
    comment_content: commentContent,
    user_id: session.userId,
    comment_title: commentTitle,
  };

  const createComment = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      }
    );

    await getComments();
  };

  const removeComment = async (commentId: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: session.userId }),
      }
    );

    await getComments();
  };

  const postData = {
    content: postContent,
    user_id: session.userId,
    title: postTitle,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };

  const onSubmit = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/posts`,
      options
    );

    await fetchPosts();
  };

  function openLink(url: string) {
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen h-full bg-slate-900">
      <section className="flex justify-between p-5">
        <h1 className="text-3xl text-gray-300 font-medium">Med App</h1>
        <section className="flex space-x-4">
          <button
            className="bg-sky-700 rounded-lg px-4 py-2 text-slate-300"
            onClick={() => router.push("/doc_profiles")}
          >
            View Doctors
          </button>
          <button
            className="bg-sky-700 rounded-lg px-4 py-2 text-slate-300"
            onClick={() => setIsOpened(true)}
          >
            Create Inquiry
          </button>
          <button
            className="bg-red-700 rounded-lg px-4 py-2 text-slate-300"
            onClick={logoutClicked}
          >
            Logout
          </button>
        </section>
      </section>

      <section className="flex justify-end px-5  space-x-4">
        <button
          className="bg-sky-700 rounded-lg px-4 py-2 text-slate-300"
          onClick={() => router.push("/on_boarding")}
        >
          Take Doc Survey
        </button>
        <button
          className="bg-sky-700 rounded-lg px-4 py-2 text-slate-300"
          onClick={() => router.push("/find_docs")}
        >
          Find Doctors
        </button>
      </section>

      {posts && posts.length > 0 ? (
        <section className="flex flex-col space-y-6 mt-10 mx-10">
          {posts.map((item) => (
            <div className="bg-slate-800 p-4 rounded-md">
              <section className="flex justify-between">
                <h4 className="text-slate-300 text-lg font-medium capitalize">
                  {item.title}
                </h4>
                <button
                  className="text-slate-200 text-lg"
                  onClick={() => {
                    setIsComments(true);
                    setPostId(item._id);
                  }}
                >
                  +
                </button>
              </section>
              <p className="text-xs text-slate-300 mb-2">{item.owner_email}</p>
              <p className="text-slate-300">{item.content}</p>

              <div className="flex flex-col space-y-4 mt-2">
                {comments.map((comment) => {
                  if (comment.post_id === item._id)
                    return (
                      <div className="bg-slate-700 p-4 rounded-lg text-slate-300">
                        <section className="flex justify-between">
                          <div className="flex items-center space-x-2">
                            <h4>{comment.comment_title}</h4>
                            <Badge size="xs" color="green" variant="outline">
                              Verified Doctor
                            </Badge>
                          </div>
                          <button
                            className="text-slate-200 text-lg"
                            onClick={() => removeComment(comment._id)}
                          >
                            -
                          </button>
                        </section>
                        <p className="text-sm">{comment.comment_content}</p>
                      </div>
                    );
                  return null;
                })}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <Modal opened={isOpened} onClose={() => setIsOpened(false)}>
        <div className="flex flex-col space-y-4">
          <h3>Enter details of the Inquiry</h3>
          <Input
            title="Title"
            placeholder="Title"
            variant="filled"
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <Textarea
            title="Content"
            placeholder="Content"
            variant="filled"
            onChange={(e) => setPostContent(e.target.value)}
          />
          <button
            className="bg-sky-600 rounded-lg px-4 py-2 text-slate-100 text-sm"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </Modal>

      <Modal opened={isComments} onClose={() => setIsComments(false)}>
        <div className="flex flex-col space-y-4">
          <h3>Enter details of the comment</h3>
          <Input
            title="Title"
            placeholder="Title"
            variant="filled"
            onChange={(e) => setCommentTitle(e.target.value)}
          />
          <Textarea
            title="Content"
            placeholder="Content"
            variant="filled"
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            className="bg-sky-600 rounded-lg px-4 py-2 text-slate-100 text-sm"
            onClick={createComment}
          >
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function Inquires(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
