const { User } = require("../models");
const Follow = require("../models/Follow");

const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "createdAt"], // adjust fields as needed
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const followerList = await Follow.findAll({
      where : {
        following_id : user.id
      },
      attributes : ["follower_id"]
    });

    const followingList = await Follow.findAll({
      where : {
        follower_id : user.id
      },
      attributes : ["following_id"]
    });

    res.json({user, followerList, followingList});
  } catch (error) {
    error.location = "getUserProfile Controller";
    next(error);
  }
};

const getProfileByUserName = async (req, res, next) => {
  try {
    const { userName } = req.params;
    
    const result = await User.findOne({
      where: { userName: userName },
      attributes: ["name", "email", "id", "createdAt"],
    });

    const followingCnt = await Follow.count({
      where : {
        "follower_id" : result.id,
      }
    });

    const followerCnt = await Follow.count({
      where : {
        "following_id" : result.id
      }
    });

    result.dataValues.followers = followerCnt;
    result.dataValues.following = followingCnt;

    res.status(200).json(result);
  } catch (error) {
    error.location = "getProfileByUserName Controller";
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const {following_id} = req.body;
    const {userId : follower_id} = req.user;

    // checking the existence of following_id
    const user = await User.findByPk(following_id);

    if(!user) {
      throw new Error("User doesn't exist");
    }

    // does this relationship already exist
    const relationship = await Follow.findOne({
      where : {
        follower_id, following_id
      }
    });

    if(relationship) {
      throw new Error(`You already followed the ${user.username}`)
    }

    const result = await Follow.create({follower_id, following_id});

    res.status(201).json({"Message" : "User Followed Successfully", result});
  } catch (error) {
    error.location = "followUser Controller";
    next(error);
  }
}

const getFollower = async (req, res, next) => {
  try {
    const {userId} = req.user;
    console.log(userId)
    const result = await Follow.findAll({
      where : {
        following_id : userId,
      },
      attributes : ["follower_id"]
    });

    res.status(200).json(result);
  } catch (error) {
    error.location = "getFollower Controller";
    next(error);
  }
}

const getFollowing = async (req, res, next) => {
  try {
    const {userId : follower_id} = req.user;

    const result = await Follow.findAll({
      where : {
        follower_id : follower_id
      },
      attributes : ["following_id"]
    });

    res.status(200).json(result);

  } catch (error) {
    error.location = "getFollowing Controller"
    next(error);
  }
}

module.exports = {
  getUserProfile,
  getProfileByUserName,
  followUser,
  getFollower,
  getFollowing,
};
