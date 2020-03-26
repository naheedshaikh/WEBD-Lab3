class Contact
{
    constructor(contactName = "", emailAddress = "", contactNumber = "", contactMessage = "")
    {
        this.contactName = contactName;
        this.emailAddress = emailAddress;
        this.contactNumber = contactNumber;
        this.contactMessage = contactMessage;
    }
}

class Item
{
    constructor(productID, productName, developer, description, price)
    {
        this.productID = productID;
        this.productName = productName;
        this.developer = developer;
        this.description = description;
        this.price = price;
    }
}




"use strict";
//IIFE - Immediately Invoked Function Expression
// mean? -> anonymous self-executing function

let app;
(function(app){

    // Declare Function Variables here...
    console.log("%cDeclaring Variables", "color: red;")
    let contactObject = new Contact();

    /**
     * Variable initialization in this function
     *
     */
    function Start()
    {
       PageSwitcher();

        Main();
    }

    function PageSwitcher()
    {
        let name = window.location.pathname;

       let pageName = name.substring(1, name.length - 5);

       DisplayHomePageContent();
    }

    /**
     * This function injects content into the targetElement's container
     * 
     * The pageName parameter is optional.
     * The async parameter has a default setting of true and is optional
     *
     * @param {string} targetElement
     * @param {string} filePath
     * @param {function} [callback]
     * @param {string} [pageName]
     * @param {boolean} [async=true]
     * @returns {void}
     */
    function LoadPageContent(targetElement, filePath, callback, pageName, async=true)
    {
        let container = document.getElementById(targetElement);

        // Step 1 - wrap everything in a try / catch
        try {
            // Step 2 - instantiate an XHR object
            let XHR = new XMLHttpRequest();
 
            // Step 3 - attach an event listener
            XHR.addEventListener("readystatechange", function(){
             if((XHR.readyState === 4) && (XHR.status === 200))
             {
                 // Step 6 - do something with the data
                 let content =  XHR.responseText;
 
                 container.innerHTML = content;
 
                if(pageName)
                {
                    document.getElementById(pageName).className = "nav-item active";
                }

                if(callback)
                {
                    callback();
                }
                
             }
 
            });
 
            // Step 4. - code your request
            XHR.open("GET",filePath, async);
 
            // Step 5 - send the request to the server
            XHR.send();
 
        } catch (error) {
            
        }
    }

    function activateNavbar()
    {
        let navLinks = [];
        let callbacks = [];

        let ul = document.getElementsByTagName("ul")[0];

        let children =  ul.children;

        for (const child of children) {
            navLinks[child.id]  = document.getElementById(child.id);
             navLinks[child.id].children[0].addEventListener("click", function(){
                switch(child.id)
                {
                    case "home":
                        LoadPageContent("mainContent", "./Views/content/home.html");
                        break;
                    case "products":
                        LoadPageContent("mainContent", "./Views/content/products.html", DisplayProductsContent);
                        break;  
                    case "services":
                        LoadPageContent("mainContent", "./Views/content/services.html",DisplayServicesContent);
                        break; 
                    case "about":
                        LoadPageContent("mainContent", "./Views/content/about.html", DisplayAboutContent);
                        break; 
                    case "contact":
                        LoadPageContent("mainContent", "./Views/content/contact.html", DisplayContactContent);
                        break; 
                    case "login":
                        LoadPageContent("mainContent", "./Views/content/login.html", DisplayLoginContent);
                        break;
                }
            }); 
        }
        
    }

    function DisplayHomePageContent()
    {
        document.title = "WEBD6201 - Home";

       LoadPageContent("mainHeader","./Views/partials/header.html", activateNavbar, "home");

       LoadPageContent("mainContent", "./Views/content/home.html");

       LoadPageContent("mainFooter","./Views/partials/footer.html");
       
    }

    function DisplayProductsContent()
    {
        document.title = "WEBD6201 - Products";
        let products = [];

        // 1. CREATE A TRY / CATCH FOR EXCEPTION HANDLING
        try {
            // 2. INSTANTIATE A NEW XHR OBJECT
            let XHR = new XMLHttpRequest();

            // 3. ADD AN EVENT LISTENER FOR "READSTATECHANGE"
            XHR.addEventListener("readystatechange", function(){
                if((XHR.readyState === 4) && (XHR.status === 200))
                {
                    // 6. GET A RESPONSE FROM THE SERVER
                    let data = JSON.parse(XHR.responseText);
                    
                    data.products.forEach(item => {
                        products.push(new Item(item.productID, item.productName, item.developer, item.description, item.price));
                    });

                    // 7. CREATE NEW ELEMENTS AND INJECT THEM AND THE DATA ONTO THE PAGE
                    
                    let productsBody = document.getElementById("productsBody");

                    for (let index = 0; index < products.length; index++) {
                        
                        let newRow = document.createElement("tr");

                        // make use of a template string
                        let newItem = 
                        `
                        <th scope="row">${index + 1}</th>
                        <td>${products[index].productID}</td>
                        <td>${products[index].productName}</td>
                        <td>${products[index].developer}</td>
                        <td>${products[index].description}</td>
                        <td>${products[index].price}</td>
                        `

                        newRow.innerHTML = newItem;

                        productsBody.appendChild(newRow);
                    }

                    

                }
            });
        
            // 4. OPEN A CHANNEL - MAKE A REQUEST WITH THE APPROPRIATE URL
             XHR.open("GET","./data/products.json",true);

             // 5. SEND THE REQUEST TO THE SERVER
             XHR.send();
        } catch (error) {
            console.log("Error: " + error);
        }

        
    }

    function DisplayServicesContent()
    {
        document.title = "WEBD6201 - Services";

    }

    function DisplayAboutContent()
    {
        document.title = "WEBD6201 - About Us";
    }

    function DisplayContactContent()
    {
        document.title = "WEBD6201 - Contact Us";
        function clearForm()
        {
            //document.getElementById("contactForm").reset();
            $("#contactForm")[0].reset();
            $("#errorMessage").hide();
        }

        function validateInput(selector, condition, errorMessage)
        {
            if(condition)
            {
                $("#errorMessage").show();
                $("#errorMessage").text(errorMessage);
                $(selector).select();
                $(selector).css("border", "2px solid red");
            }
            else
            {
                $("#errorMessage").hide();
                $(selector).css("border", "1px solid #ced4da");
            }
        }

        $("#errorMessage").hide();
        $("#contactName").select();

        // Contact Name Events
        $("#contactName").blur((e)=>
        {
            validateInput("#contactName",( $("#contactName").val().length < 2),"Contact Name is Too Short");
        });

        $("#contactName").focus((e)=>
        {
            $("#contactName").select();
        });

        // Email Events
        $("#emailAddress").blur((e)=>
        {
            validateInput("#emailAddress",($("#emailAddress").val().length < 8) || (!$("#emailAddress").val().includes("@")),"Invalid Email Address");
        });

        $("#emailAddress").focus((e)=>
        {
            $("#emailAddress").select();
        });

        // Contact Number Events
        $("#contactNumber").blur((e)=>
        {
            let phonePattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
            let phoneNumber = $("#contactNumber").val();

            validateInput("#contactNumber",( !phonePattern.test(phoneNumber)),"Invalid Contact Number");
        });

        $("#contactNumber").focus((e)=>
        {
            $("#contactNumber").select();
        });

        // Contact Message Events
        $("#contactMessage").blur((e)=>
        {
            validateInput("#contactMessage",( $("#contactMessage").val().length < 2 ),"Contact Message Too Short");
        });

        $("#contactMessage").focus((e)=>
        {
            $("#contactMessage").select();
        });


        $("#contactForm").submit  ((e)=>
        {
            if(document.getElementById("contactForm").checkValidity() == false)
            {
                e.preventDefault();
                e.stopPropagation();
                console.log("form not valid");
            }

            
            let contactName = $("#contactName").val();
            let emailAddress = $("#emailAddress").val();
            let contactNumber = $("#contactNumber").val();
            let contactMessage = $("#contactMessage").val();

            console.log(`Contact Name: ${contactName}`);
            console.log(`Email Address: ${emailAddress}`);
            console.log(`Contact Number: ${contactNumber}`);
            console.log(`Contact Message: ${contactMessage}`);

            contactObject.contactName = contactName;
            contactObject.emailAddress = emailAddress;
            contactObject.contactNumber = contactNumber;
            contactObject.contactMessage = contactMessage;

            console.log(contactObject);

            clearForm();
        });

        $("#resetButton").click((e)=>
        {
            e.preventDefault();
            if(confirm("Are You Sure?"))
            {
                clearForm();
            }

            
        });
    }

    function DisplayProjectsContent()
    {
        document.title = "WEBD6201 - Projects";
    }

    function DisplayLoginContent()
    {
        document.title = "WEBD6201 - Login";

        $("#loginForm").submit  ((e)=>
        {
           
            e.preventDefault();
            e.stopPropagation();
            $("#loginForm")[0].reset();
            $("#login").hide();
            $("#logout").show();

        });

    }

    function DisplayRegisterContent()
    {
        document.title = "WEBD6201 - Register";
    }

    function DisplayTaskList()
    {
        document.title = "WEBD6201 - Task List";

        // Task 1 a
        $("#newTaskButton").on("click", function(){
            let inputText = $("#taskTextInput").val();

            let newElement = 
            `
            <li class="list-group-item" id="task">
            <span id="taskText">${inputText}</span>
            <span class="float-right">
                <button class="btn btn-outline-primary btn-sm editButton"><i class="fas fa-edit"></i>
                <button class="btn btn-outline-danger btn-sm deleteButton"><i class="fas fa-trash-alt"></i></button>
            </span>
            <input type="text" class="form-control edit-task editTextInput">
            </li>
            `
            
            $("#taskList").append(newElement);
        });

        // Task 1 b

        $("ul").on("click", ".editButton", function(){
           let editText = $(this).parent().parent().children(".editTextInput");
           let text = $(this).parent().parent().text();
           editText.val(text);
           editText.show();
           editText.select();
           editText.keypress(function(event){
            if(event.keyCode == "13")
            {
                editText.hide();
                $(this).parent().children("#taskText").text(editText.val());
            }
           });
        });

        // Task 1 c
        $("ul").on("click", ".deleteButton", function(){
            if(confirm("Are you sure?"))
            {
                $(this).closest("li").remove();
            }    
        });
    }

    /**
     * Main Program entry point is here
     *
     */
    function Main()
    {
       
    }
    
    

    window.addEventListener("load", Start);
})(app || (app = {}));

