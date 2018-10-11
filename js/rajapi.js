$(document).ready(function(){
  $.getJSON('api.json', function(data){
    var apiKey = data.api_key
    var baseUrl = data.base_url + data.type_akun + '/'

    $.ajax({
      type: "GET",
      url: 'rajaongkir.php',
      data: {api: apiKey, url: baseUrl+'province'},
    }).done(function(data) {
      var datjson = JSON.parse(data).rajaongkir.results

      $.each(datjson, function(key, value){
        var id = value.province_id
        var prov = value.province
        $('.provinsi').append('<option data-id="'+id+'">'+prov+'</option>')
      })
    });

    $(document).on('change', '#provinsi_asal', function(){
      var idProv = $('#provinsi_asal option:selected').attr('data-id')
      $('#kota_asal').empty()
      $('#kota_asal').append('<option>-- Pilih Kota Asal --</option>')

      $.ajax({
        type: "GET",
        url: 'rajaongkir.php',
        data: {api: apiKey, url: baseUrl+'city?province='+idProv},
      }).done(function(data) {
        var datjson = JSON.parse(data).rajaongkir.results

        $.each(datjson, function(key, value){
          var id = value.city_id
          var city = value.city_name
          $('#kota_asal').append('<option data-id="'+id+'">'+city+'</option>')
        })
      })
    })

    $(document).on('change', '#provinsi_tujuan', function(){
      var idProv = $('#provinsi_tujuan option:selected').attr('data-id')
      $('#kota_tujuan').empty()
      $('#kota_tujuan').append('<option>-- Pilih Kota Tujuan --</option>')

      $.ajax({
        type: "GET",
        url: 'rajaongkir.php',
        data: {api: apiKey, url: baseUrl+'city?province='+idProv},
      }).done(function(data) {
        var datjson = JSON.parse(data).rajaongkir.results

        $.each(datjson, function(key, value){
          var id = value.city_id
          var city = value.city_name
          $('#kota_tujuan').append('<option data-id="'+id+'">'+city+'</option>')
        })
      })
    })

    $('#cek_ongkir').on('click', function(){
      $('#hasil').empty()
      var kotaAsl = $('#kota_asal option:selected').attr('data-id')
      var kotaTjn = $('#kota_tujuan option:selected').attr('data-id')
      var kurir = $('#kurir option:selected').val()
      var berat = $('#berat').val()

      if (kotaAsl == null || kotaTjn == null || berat.length == 0) {
        alert('Semua harus diisi!!')
      } else {
        $.ajax({
          type: "POST",
          url: 'rajaongkir.php',
          data: {
            api: apiKey, url: baseUrl+'cost', asal: kotaAsl,
            tujuan: kotaTjn, kurir: kurir, berat: berat
          },
        }).done(function(data) {
          var datjson = JSON.parse(data).rajaongkir.results[0].costs

          if (datjson.length == 0) {
            alert('kurir tidak tersedia')
          } else {
            var nmkurir = JSON.parse(data).rajaongkir.results[0].name
            // console.log(nmkurir)
            $('#hasil').append("<h1 class='text-center mb-3'>Ekspedisi "+nmkurir+"</h1>")
            $('#hasil').append("<table class='table mb-5'><thead class='thead-dark'><tr><th>#</th><th>Kode Service</th><th>Ongkos Kirim</th><th>Lama Pengiriman</th></tr></thead><tbody></tbody></table>")
          }

          $.each(datjson, function(key, value){
            var service = value.service
            var harga = value.cost[0].value
            var etd = value.cost[0].etd + ' hari'
            var fmt = new Intl.NumberFormat('de-DE').format(harga)

            $('#hasil tbody').append("<tr><td>"+ ++key +"</td><td>"+service+"</td><td>Rp. "+fmt+"</td><td>"+etd+"</td></tr>")
          })
        })
      }
    })
  })
})
