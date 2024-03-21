function toggleSection(projectid){
    project = document.getElementById(projectid);
    projectButton = document.getElementById(projectid + "-button")
    console.log(project.style.display == "none")
    if(project.style.display == "none"){
      project.style.display = "block";
      projectButton.innerHTML = "Close<img src=\"/images/chevron-up.svg\"/>"
    }
    else{
      project.style.display = "none";
      projectButton.innerHTML = "Read More<img src=\"/images/chevron-down.svg\"/>"
    }
  }
