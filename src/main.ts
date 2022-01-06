import "bootstrap/dist/css/bootstrap.css";
import m from "mithril";

interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}
function GetList(): m.Component {
    const posts: IPost[] = [];

    m.request<IPost[]>({
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/posts",
    }).then((data) => posts.push(...data));
    return {
        view: () =>
            m(
                "div.card",
                m(
                    "ul.list-group",
                    posts.map((post) =>
                        m(
                            "li.list-group-item",
                            m(
                                m.route.Link,
                                {
                                    href: `/posts/${post.id}`,
                                },
                                post.title
                            ),
                            m(
                                "button.btn-close",
                                { onclick: () => deletePost(post.id) },
                                ""
                            )
                        )
                    )
                ),

                m(
                    m.route.Link,
                    {
                        href: "/posts",
                        className: "btn btn-primary",
                    },
                    "新增"
                )
            ),
    };
}

function deletePost(postId: number): void {
    m.request({
        method: "DELETE",
        url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
    });
}

function savePost(post: IPost, callback: Function): void {
    const isCreate = post.id === -1;
    const url =
        "https://jsonplaceholder.typicode.com/posts" +
        (isCreate ? "" : `/${post.id}`);
    m.request<IPost>({
        method: isCreate ? "POST" : "PUT",
        url,
        body: post,
    }).then((data) => callback(data));
}

function PostForm(): m.Component {
    let post: IPost = {
        userId: -1,
        id: -1,
        title: "",
        body: "",
    };
    const id = m.route.param("id");
    if (id) {
        m.request<IPost>({
            method: "GET",
            url: `https://jsonplaceholder.typicode.com/posts/${id}`,
        }).then((data) => (post = data));
    }
    return {
        view: () =>
            m(
                "form",
                m(
                    "div.mb-3",
                    m("label.form-label", "标题："),
                    m('input.form-control[type="text"]', {
                        value: post.title,
                        onchange: (e: Event) =>
                            (post.title = (e.target as HTMLInputElement).value),
                    })
                ),
                m(
                    "div.mb-3",
                    m("label.form-label", "内容："),
                    m('textarea.form-control[rows="5"]', {
                        value: post.body,
                        onchange: (e: Event) =>
                            (post.body = (
                                e.target as HTMLTextAreaElement
                            ).value),
                    })
                ),
                m(
                    "div",
                    m("label.form-label", ""),
                    m(
                        'button.btn.btn-primary[type="button"]',
                        {
                            onclick: () =>
                                savePost(post, () => {
                                    console.log("保存操作完成");
                                }),
                        },
                        "立即保存"
                    )
                )
            ),
    };
}
function setupRouting(root: Element): void {
    m.route.prefix = "";

    m.route(root, "/", {
        "/": GetList, // 获取列表
        "/posts": PostForm, // 发送数据
        "/posts/:id": PostForm, // 更新数据
    });
}

function App(): m.Component {
    return {
        view: () =>
            m(
                "div.app",
                m("header.p-3.bg-dark.text-white", "Mithril Study"),
                m("main.container.pt-5.pb-5", {
                    oncreate: (vnode: m.VnodeDOM) => setupRouting(vnode.dom),
                }),
                m(
                    "footer.nav.justify-content-center.border-top.pb-3.pt-3.mt-3",
                    "Mithril is simple yet powerful，一个简单却很强大的前端框架"
                )
            ),
    };
}
m.mount(document.body, App);
