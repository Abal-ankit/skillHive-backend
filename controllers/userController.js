const { Op } = require("sequelize");
const { User } = require("../models");
const Follow = require("../models/Follow");

const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findByPk(userId, {
      attributes: ["id","userName",  "name", "email", "createdAt"], // adjust fields as needed
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const followingCnt = await Follow.count({
      where: {
        follower_id: userId,
      },
    });

    const followerCnt = await Follow.count({
      where: {
        following_id: userId,
      },
    });

    user.dataValues.followers = followerCnt;
    user.dataValues.followings = followingCnt;

    res.json(user);
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
      attributes: ["name","userName", "email", "id", "createdAt"],
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
    result.dataValues.followings = followingCnt;
    result.dataValues.canFollow = false;
    result.dataValues.isFollowing = false;

    // console.log("user: ", req.user);
    if(req?.user) {
      const {userId} = req.user;

      // same person
      if(userId === result.id) {
        return res.status(200).json(result);
      }

      // is follower
      const isFollower = await Follow.count({
        where : {
          "follower_id" : userId,
          "following_id" : result.id
        }
      });

      if(isFollower == 0) {
        result.dataValues.canFollow = true;
      }

      // is following
      const isFollowing = await Follow.count({
        where : {
          "following_id" : userId,
          "follower_id" : result.id,
        }
      });

      if(isFollowing != 0) {
        result.dataValues.isFollowing = true;
      }
    }

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
      throw new Error(`You already followed the ${user.dataValues.userName}`)
      // res.status(500).json({"Message" : "You already follow"});
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
    const {id : userId} = req.params;
    // console.log("Id: ", userId);

    const result = await Follow.findAll({
      where : {
        following_id : userId,
      },
      attributes : ["follower_id"],
      raw : true
    });

    const followerData = await User.findAll({
      where: {
        "id" : [...result.map(temp => temp.follower_id)],
      },
      attributes : ["id", "name", "userName"]
    });

    console.log(JSON.stringify(followerData));
    
    res.status(200).json(followerData);
  } catch (error) {
    error.location = "getFollower Controller";
    next(error);
  }
}

const getFollowing = async (req, res, next) => {
  try {
    const {id : follower_id} = req.params;

    const result = await Follow.findAll({
      where : {
        follower_id : follower_id
      },
      attributes : ["following_id"]
    });

    const followingData = await User.findAll({
      where: {
        id : [...result.map(temp => temp.following_id)]
      },
      attributes : ["id", "name", "userName"],
      raw : true
    })

    console.log(followingData)
    res.status(200).json(followingData);

  } catch (error) {
    error.location = "getFollowing Controller"
    next(error);
  }
}

const getSearchResults = async (req, res, next) => {
  try {
    const {query} = req.body;

    if(!query) {
      return res.status(200).json([]);
    }

    const result = await User.findAll({
      where : {
        userName : {
          [Op.like] : `%${query}%`
        }
      },

      attributes : ["userName", "id", "name"],
      raw : true
    });

    res.status(200).json(result);
  } catch (error) {
    error.location = "getSearchResults Controller";
    next(error);
  }
}

module.exports = {
  getUserProfile,
  getProfileByUserName,
  followUser,
  getFollower,
  getFollowing,
  getSearchResults,
};
