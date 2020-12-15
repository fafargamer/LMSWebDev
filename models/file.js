const fileSchema = ({ 
    filename: String,
    DBfilename: String,
    namaUser: String,
    mataPelajaran: String,
    totalPoin: Number,
    jumlahrating: Number,
    tanggalUnggah: Date, 
    desc: String 
}); 
  
module.exports = fileSchema;

