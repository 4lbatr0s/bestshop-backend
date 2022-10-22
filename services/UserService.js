import BaseService from "./BaseService";
import UserModel from "../models/User";

//INFO: how to create a service.
class UserService extends BaseService {

    model = UserModel;
}


module.exports = new UserService(); //INFO: how to import a service.