class API {
  constructor(){
    console.log("API setup")
  }

  async init(){
    this._cUser = await this.getUser();
    return this;
  }

  get domain(){
    try {
      if(typeof window === undefined) return;
      return "api."+window.location.host;
    } catch(e){
      return process.env.API_DOMAIN;
    }
  }
  get baseURL(){
    return "https://"+this.domain;
  }
  Get(url, body, headers){
    return fetch(this.baseURL+"/"+url, Object.assign({
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: Object.assign({
        'Content-Type': 'application/json'
      },headers),
      body: JSON.stringify(body)
    }));
  }
  Post(url, body, headers){
    return fetch(this.baseURL+"/"+url, Object.assign({
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: Object.assign({
        'Content-Type': 'application/json'
      },headers),
      body: JSON.stringify(body)
    }));
  }

  async getUser(id = ""){
    return await this.Get("user/"+id).then(r=>r.json());
  }

  get currentUser(){
    return this._cUser;
  }

  async editUser(id, data){
    return this.Post(`user/${id}/update`, data)
  }
}

export default new API();
