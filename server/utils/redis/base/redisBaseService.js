const _redis = require("../config");

const get = async (key) => {
    try {
        return await _redis.get(key);
    } catch (error) {
        console.log(`Error getting key ${key}:`, error);
        throw error;
    }
};

const set = async (key, value, ttl = null) => {
    try {
        if (ttl) {
            await _redis.set(key, value, 'EX', ttl);
        } else {
            await _redis.set(key, value);
        }
    } catch (error) {
        console.log("key-value", key, " - ", value);
        console.log(`Error setting key ${key}:`, error);
        throw error;
    }
};

const remove = async (key) => {
    try {
        await _redis.del(key);
    } catch (error) {
        console.log(`Error deleting key ${key}:`, error);
        throw error;
    }
};

const increment = async (key, amount = 1) => {
    try {
        return await _redis.incrby(key, amount);
    } catch (error) {
        console.log(`Error incrementing key ${key}:`, error);
        throw error;
    }
};

const decrement = async (key, amount = 1) => {
    try {
        return await _redis.decrby(key, amount);
    } catch (error) {
        console.log(`Error decrementing key ${key}:`, error);
        throw error;
    }
};


module.exports = {
    get,
    set,
    remove,
    increment,
    decrement
};
