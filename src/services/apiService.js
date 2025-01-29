export default {

    BASE_URL: "https://freesound.org/apiv2",
    TOKEN: "94QI2cQexWIEFtOEIBCoQOUja0rKDf0N3JXFuaGp",

    async get(url) {
        url = url + "&token=" + this.TOKEN;

        return await fetch(url);
    },

    async getSounds(){
        let response = (await this.get(this.BASE_URL + "/search/text/?search=")).json();   
        
        return response;
    },

    async getsoundData(id){
        let response = (await this.get(this.BASE_URL + "/sounds/" + id +"/?")).json();   
        
        return response;
    }

}