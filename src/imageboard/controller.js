import * as imageModel from "./imageModel.js";
import * as commentModel from "./commentModel.js";
import * as userModel from "./userModel.js";

export async function index(ctx) {
  const imageData = await imageModel.getAllImages(ctx.db);

  await ctx.render("index", { images: imageData });
}

export async function profile(ctx) {
  const userData = await userModel.getAllUser(ctx.db);

  await ctx.render("profile", {
    users: userData,
  });
}

export async function profileDetail(ctx) {
  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  await ctx.render("profileDetail", {
    user: userData,
  });
}

export async function editProfile(ctx) {
  const userData = await userModel.getUser(ctx.db, ctx.params.username);

  await ctx.render("profileEdit", {
    user: userData,
  });
}

export async function deleteProfile(ctx) {
  await userModel.deleteProfilePicture(ctx.db, ctx.params.username);
  const userData = await userModel.deleteUser(ctx.db, ctx.params.username);
  ctx.redirect("/profile");

  if (userData != 0) {
    ctx.status = 204;
    ctx.redirect("/profile");

    return;
  } else {
    ctx.status = 404;
    ctx.redirect("/profile");

    return;
  }
}

export async function login(ctx) {
  await ctx.render("login");
}

export async function createUser(ctx) {
  await ctx.render("usercreate");
}

export async function renderUpload(ctx) {
  await ctx.render("upload");
}

export async function upload(ctx) {
  const uploadPath = ctx.request.files.image.path;
  const fileType = ctx.request.files.image.type;

  const fileName = getFileName(uploadPath);

  if (fileType.includes("image/png") || fileType.includes("image/jpeg")) {
    await imageModel.addImage(ctx.db, fileName);
  } else {
    await imageModel.deleteFile(uploadPath);
  }

  await ctx.render("upload");
  ctx.redirect("/");
}

export async function askDelete(ctx) {
  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);

  await ctx.render("deleteForm", {
    image: imageData,
  });
}

export async function deleteImageById(ctx) {
  const imageData = await imageModel.deleteImageById(ctx.db, ctx.params.id);
  const commentData = await commentModel.deleteCommentsByImage(
    ctx.db,
    ctx.params.id
  );
  ctx.redirect("/");

  if (imageData != 0 && commentData != 0) {
    ctx.status = 204;
    ctx.redirect("/");

    return;
  } else {
    ctx.status = 404;
    ctx.redirect("/");

    return;
  }
}

export async function deleteCommentById(ctx) {
  const commentData = await commentModel.deleteSingleComment(
    ctx.db,
    ctx.params.commentid
  );

  if (commentData != 0) {
    ctx.status = 204;
    ctx.redirect("/image/" + ctx.params.id);

    return;
  } else {
    ctx.status = 404;
    ctx.redirect("/");

    return;
  }
}

// --------------Helper functions----------------

function getFileName(filePath) {
  if (filePath.includes("/")) {
    const temp = filePath.split("/");
    return temp[temp.length - 1];
  } else {
    const temp = filePath.split("\\");
    return temp[temp.length - 1];
  }
}

// ----------------------------------------------
