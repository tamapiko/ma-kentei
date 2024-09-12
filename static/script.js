document.getElementById('file-upload').onchange = function () {
    let fileName = this.files.length > 1 ? this.files.length + ' files selected' : this.files[0].name;
    this.nextElementSibling.innerText = fileName;
};
