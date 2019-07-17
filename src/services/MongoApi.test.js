import {getSearchData} from "~/services/MongoApi";
test ("runs", () =>{
    let data= getSearchData(["ATP", "Escherichia coli"]);
    expect(data).toBeTruthy; 
});
test("return null on no match", () => {
    let data= getSearchData(["ATPa", "Escherichia coli"]);
    expect(data).toBeNull; 
});

 