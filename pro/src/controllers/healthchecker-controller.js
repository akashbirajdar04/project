import { ApiResponse } from "../utills/api-response.js"
import { Asynchandler } from "../utills/Aynchandler.js"
const healthchecker=Asynchandler((req,res)=>
{
      res.status(200).json(new ApiResponse(200,"server is running"))
})
export {healthchecker}