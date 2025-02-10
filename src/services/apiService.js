export default {
    BASE_URL: "https://freesound.org/apiv2",
    TOKEN: "94QI2cQexWIEFtOEIBCoQOUja0rKDf0N3JXFuaGp",

    async get(url) {
        url = url.includes("token=") ? url : url + "&token=" + this.TOKEN;
        let response = await fetch(url);
        return response.json();
    },

    async getSounds(searchQuery = "") {
        return this.get(`${this.BASE_URL}/search/text/?query=${searchQuery}`);
    },

    async getsoundData(id) {
        return this.get(`${this.BASE_URL}/sounds/${id}/?`);
    },

    async getNextPage(url) {
        return this.get(url);
    }
};
