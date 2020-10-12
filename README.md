# dataloader-plugin

#invoking the function by the following 
-----------------------------------------------------------------
$(document).ready(function () {
-----------------------------------------------------------------

    dataloader(
        ".WebpageContent",                  [ Layout Parent Wrapper Container  ]
        "#dataloader",                      [ Table Id ]
        "/Apis/FactoryCount",               [ Data Count Api Url ]
        "/Apis/ItemFactoryModel",           [ Data Listed Api Url ]
        "/Apis/ItemFactorySearch",          [ Data Searchable API Url]
        "taken",                            [ how much you want to take parameter ]
        10,                                 [ how much you want to take value ]     = default 10 
        "EndId",                            [ Start Id to take after from the api ]
        "text",                             [ the search key param for the api name ]
        5,                                  [ how much buttons you want to in each slide ]   = default 5 
        ["Id", "Name"]                      [ your wanted params from the api ]
        true ,                              [ you want options operations for that table ? delete or update ] = default true 
        true ,                              [ you want to hide operations buttons from the search results ? ]  = default true 
        true,                               [ you want the delete operation button ? ]  = default true 
        false,                              [ you want the edit operations button ? ] = default false 
        false                               [ you want the print operations button ? ] = default false 
    );
    
-----------------------------------------------------------------

});

# using operations classes to create crud operations 
-----------------------------------------------------------------
  - > if you want to use the DELETE operations button use the following class (  delete-custom-datatable )   
  - > if you want to use the EDIT operations button use the following class (  edit-custom-datatable )   
  - > if you want to use the PRINT operations button use the following class (  print-custom-datatable ) 
 
 With the following recommendations : 
 
 $(PARENTCLASSORID).on("click",OPTIONSCLASSNAME,function(){
  // do your need code here 
 });
