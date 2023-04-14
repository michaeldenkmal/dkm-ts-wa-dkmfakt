function kundenlst() {
    $root_url="http://localhost:5000"

    #$contexts = @("waGaStatistik", "dkmMVC")

    $url = "$root_url/kundenhonorar/list"
    WRITE-HOst $url
    #echo "url=$url"
    #    $data = Invoke-RestMethod -Uri $url
    #    $data | Format-List
    #$postParams = @{clazzNameExpr=$classNameExpr;logLevel=$level}
    $data = Invoke-WebRequest -Uri $url -Method GET 
    $data
}

kundenlst
