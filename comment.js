const commentParams = new URLSearchParams(window.location.search);
const commentProductId = Number(commentParams.get("id"));

let selectedRating = 5;


// ===============================
// LOAD COMMENTS
// ===============================

async function loadComments() {

    try {

        const response = await fetch(
            `/api/comments/${commentProductId}`
        );

        if (!response.ok) {
            throw new Error("Không thể lấy comments");
        }

        const comments = await response.json();

        const list =
            document.getElementById("comments-list");

        if (!list) {
            console.error(
                "Không tìm thấy #comments-list"
            );
            return;
        }

        list.innerHTML = "";

        if (comments.length === 0) {

            list.innerHTML = `
                <p>Chưa có đánh giá nào.</p>
            `;

            return;
        }

        comments.forEach(comment => {

            const rating =
                Number(comment.rating) || 0;

            const stars =
                "★".repeat(rating) +
                "☆".repeat(5 - rating);

            const date =
                new Date(
                    comment.createdAt
                ).toLocaleString("vi-VN");

            list.innerHTML += `
                <div class="comment-item">

                    <div class="comment-header">

                        <strong>
                            ${comment.username}
                        </strong>

                        <span>
                            ${date}
                        </span>

                    </div>

                    <div class="comment-rating">
                        ${stars}
                    </div>

                    <p>
                        ${comment.content}
                    </p>

                </div>
            `;
        });

    } catch (error) {

        console.error(
            "Lỗi load comments:",
            error
        );

    }
}


// ===============================
// CHỌN SAO
// ===============================

const ratingStars =
    document.querySelectorAll(
        ".rating-input span"
    );

ratingStars.forEach(star => {

    star.addEventListener("click", () => {

        selectedRating =
            Number(star.dataset.rating);

        ratingStars.forEach(item => {

            const rating =
                Number(item.dataset.rating);

            item.classList.toggle(
                "active",
                rating <= selectedRating
            );

        });

    });

});


// ===============================
// GỬI COMMENT
// ===============================

const submitButton =
    document.getElementById(
        "submit-comment"
    );


if (submitButton) {

    submitButton.addEventListener(
        "click",
        async () => {

            const textarea =
                document.getElementById(
                    "comment-content"
                );

            const content =
                textarea.value.trim();


            // -------------------------------
            // Kiểm tra nội dung
            // -------------------------------

            if (!content) {

                alert(
                    "Vui lòng nhập bình luận."
                );

                return;
            }


            // -------------------------------
            // Lấy user
            // -------------------------------

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (!user) {

                alert(
                    "Bạn cần đăng nhập trước."
                );

                window.location.href =
                    "/login";

                return;
            }


            // -------------------------------
            // Gửi API
            // -------------------------------

            try {

                const response =
                    await fetch(
                        "/api/comments",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                productId:
                                    commentProductId,

                                userId:
                                    user.id,

                                username:
                                    user.name,

                                rating:
                                    selectedRating,

                                content:
                                    content

                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Không thể gửi bình luận."
                    );

                    return;
                }


                // -------------------------------
                // Thành công
                // -------------------------------

                alert(
                    "Đã gửi bình luận!"
                );


                textarea.value = "";


                // Reset rating về 5 sao

                selectedRating = 5;

                ratingStars.forEach(star => {

                    star.classList.add(
                        "active"
                    );

                });


                // Load lại comments

                loadComments();

            } catch (error) {

                console.error(error);

                alert(
                    "Có lỗi xảy ra khi gửi bình luận."
                );

            }

        }
    );

}


// ===============================
// LOAD BAN ĐẦU
// ===============================

loadComments();