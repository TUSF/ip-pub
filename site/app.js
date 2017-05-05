var getNyaa = new XMLHttpRequest();
getNyaa.open('GET', 'nyaa.sqlite', true);
getNyaa.responseType = 'arraybuffer';
var page = 0;

getNyaa.onload = function(e) {
  var uInt8Array = new Uint8Array(this.response);
  db = new SQL.Database(uInt8Array);

  search = function() {
    tab = document.getElementById('results')
    tab.innerHTML = "<tr><th>Torrent name</th><th>Hash</th></tr>";

    qu = document.getElementById("search-q").value;
    vcat = document.getElementById("search-cat").value;
    max = document.getElementById("search-max").value;

    sqlstr = "SELECT * from `torrents` WHERE ";

    if(vcat != "_") {
      cats = vcat.split("_")
      sqlstr += "`category_id` = "+ cats[0];
      if(cats[1] != "") {
        sqlstr += " AND `sub_category_id` = "+cats[1];
      }
      sqlstr += " AND ";
    }

    sqlstr += "`torrent_name` LIKE '%" + qu + "%' ";

    sqlstr += "ORDER BY `torrent_id` DESC ";
    sqlstr += "LIMIT " + max + " OFFSET " + max*page + ";";
    res = db.exec(sqlstr)[0];
    table = document.getElementById("results")

    T_NAME = res.columns.indexOf("torrent_name")
    T_HASH = res.columns.indexOf("torrent_hash")

    for(var i = 0; i < res.values.length; i++) {
      tab.innerHTML += "<tr><td>"+res.values[i][T_NAME]+"</td><td>"+res.values[i][T_HASH]+"</td></tr>";
    }
  };
  document.getElementById('search-button').addEventListener("click",search);
  document.getElementById('search-q').addEventListener("keyup",function(e){
    if(e.key == "Enter") {
      search()
    }});
  document.getElementById('prev-page').addEventListener("click",function(){
    if( page > 0 ) page -= 1
    search()
    document.getElementById('cur-page').innerHTML = page;
    });
  document.getElementById('next-page').addEventListener("click",function(){
    page += 1
    search()
    document.getElementById('cur-page').innerHTML = page;
    });
  document.getElementById('wait-message').innerHTML = "";
};

getNyaa.send();

