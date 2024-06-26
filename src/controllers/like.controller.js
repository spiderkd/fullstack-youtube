import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!videoId) {
    throw new ApiError(400, "video id required");
  }
  const alreadyLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (alreadyLiked) {
    await Like.findByIdAndDelete(alreadyLiked._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false },
          "Video like removed successfully"
        )
      );
  }

  const likeVideo = await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (!likeVideo) {
    throw new ApiError(500, "Server error while liking the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeVideo, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!commentId) {
    throw new ApiError(400, "comment id required");
  }
  const alreadyLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (alreadyLiked) {
    await Like.findByIdAndDelete(alreadyLiked._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false },
          "comment like removed successfully"
        )
      );
  }

  const likeComment = await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (!likeComment) {
    throw new ApiError(500, "Server error while liking the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeComment, "comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!tweetId) {
    throw new ApiError(400, "Tweet id required");
  }
  const alreadyLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (alreadyLiked) {
    await Like.findByIdAndDelete(alreadyLiked._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false },
          "Tweet like removed successfully"
        )
      );
  }

  const likeTweet = await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (!likeTweet) {
    throw new ApiError(500, "Server error while liking the Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeTweet, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user?._id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }
  const allLikedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
            },
          },
          {
            $unwind: "$ownerDetails",
          },
        ],
      },
    },
    {
      $unwind: "$likedVideos",
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        _id: 0,
        likedVideos: {
          _id: 1,
          videoFile: 1,
          thumbnail: 1,
          owner: 1,
          title: 1,
          description: 1,
          views: 1,
          duration: 1,
          createdAt: 1,
          isPublished: 1,
          ownerDetails: {
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        },
      },
    },
  ]);
  if (allLikedVideos) {
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, allLikedVideos, "Liked Videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
