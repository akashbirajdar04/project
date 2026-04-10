import { Queue } from "bull";

 export const notQueue=Queue.add("notQueue",
    {
    reids:{host:'localhost',port:6379}
    }
)
