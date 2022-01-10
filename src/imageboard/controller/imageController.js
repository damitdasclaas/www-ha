import * as imageModel from "../model/imageModel.js";
import * as commentModel from "../model/commentModel.js";
import * as helper from "../helper/helper.js";

export async function renderForm(ctx, errors) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  await ctx.render("upload", { csrf: token, error: errors });
}

export async function upload(ctx) {
  await renderForm(ctx, undefined);
}

export async function submitUpload(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  const uploadPath = ctx.request.files.image.path;
  const fileType = ctx.request.files.image.type;

  const fileName = await helper.getFileName(uploadPath);

  const errors = await helper.validateUploadFile(fileType);

  if (Object.values(errors).some(Boolean)) {
    await imageModel.deleteFile(uploadPath);

    await renderForm(ctx, errors);
  } else {
    await imageModel.addImage(ctx.db, fileName, ctx.session.user.username);
    ctx.session.flash = "Bild erfolgreich hochgeladen.";

    ctx.redirect("/");
  }
}

export async function askDelete(ctx) {
  const token = await helper.generateToken();
  ctx.session.csrf = token;

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  const imageData = await imageModel.getSingleImage(ctx.db, ctx.params.id);

  await ctx.render("deleteImageForm", {
    image: imageData,
    csrf: token,
  });
}

export async function deleteImageById(ctx) {
  if (ctx.session.csrf !== ctx.request.body._csrf) {
    ctx.throw(401);
  }
  ctx.session.csrf = undefined;

  await imageModel.deleteImageById(ctx.db, ctx.params.id);
  await commentModel.deleteCommentsByImage(ctx.db, ctx.params.id);

  ctx.session.flash = "Eintrag wurde gelöscht.";

  ctx.redirect("/");
}
