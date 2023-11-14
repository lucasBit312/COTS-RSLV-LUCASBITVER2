import { useEffect } from "react";
import { useState } from "react";
import foodAip from "../../../Api/foodApi";

export default function useFoodDetail(foodID){
    const [food, setfood] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () =>{
            try{
                setLoading(true);
                const result = await foodAip.getDetail(foodID);
                setfood(result);
            }catch(error){
                console.log('failed to fetch product', error)
            }
            setLoading(false)
        })()
    }, [foodID])
    return {food, loading};
}