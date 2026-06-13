document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.querySelector('.cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalSpan = document.querySelector('.cart-total');

    // ===== Dropdown Toggle Logic =====
    function setupDropdown(btnSelector, dropdownSelector, otherBtnSelector) {
        const btn = document.querySelector(btnSelector);
        const otherBtn = document.querySelector(otherBtnSelector);
        if (!btn) return;

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            // If clicking on a filter option inside the dropdown, let it work but close dropdown
            if (e.target.classList.contains('filter-option')) {
                btn.classList.remove('active');
                return;
            }
            // Toggle this dropdown
            btn.classList.toggle('active');
            // Close the other dropdown
            if (otherBtn) otherBtn.classList.remove('active');
        });
    }

    setupDropdown('.categories-btn', '.categories-dropdown', '.flavors-btn');
    setupDropdown('.flavors-btn', '.flavors-dropdown', '.categories-btn');

    // Close all dropdowns when clicking anywhere else on the page
    document.addEventListener('click', function() {
        var cats = document.querySelector('.categories-btn');
        var flavs = document.querySelector('.flavors-btn');
        if (cats) cats.classList.remove('active');
        if (flavs) flavs.classList.remove('active');
    });

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // نستخدم اللغة المحفوظة (أو العربية افتراضيًا)
    const langToggle = document.getElementById("langToggle");
    let currentLang = localStorage.getItem("lang") || "ar";

    // بيانات المنتجات (يمكنك تعديلها وإضافة المزيد)
    const products = [
        {
            id: 1,
            name: 'سوبر دارك بطعم الشيكولاته الدرك',
            name_en: 'Super Dark Chocolate Flavor',
            description: 'استيك ايس كريم فاخر بنكهة الشوكليت مصنوع من أجودالمكونات.',
            description_en: 'Premium ice cream with a chocolate flavor, made from the finest ingredien.',
            price: 105,
            image: "img/product-9.jpeg"
        },
        {
            id: 2,
            name: 'استار بطعم الحليب',
            name_en: 'Star milk flavor',
            description: 'ايس كريم فاخر بنكهة الفانيليا شوكليت مصنوع من اجود المكونات كونو.',
            description_en: 'Premium ice cream with a vanilla chocolate flavor, made from the finest ingredients.',
            price: 110,
            image: "img/product-10.jpeg"
        },
        {
            id: 3,
            name: 'Vip حليب علي بستاشيو',
            name_en: 'VIP milk on pistachio',
            description: 'آيس كريم كريمي بنكهة المانجاو الشوكليت والفراولة مصنوع من اجود المكونات كب.',
            description_en: 'Creamy ice cream with mango, chocolate, and strawberry flavor, made from the finest ingredients.',
            price: 200,
            image: "img/product-11.jpeg"
        },
        {
            id: 5,
            name: 'فسدقه حليب مغطي بالبستاشيو',
            name_en: 'Pistachio milk topped with pistachios',
            description: 'آيس كريم منعش بنكهة الفانيليا والشوكليت استيك.',
            description_en: 'Refreshing vanilla and chocolate flavored ice cream.',
            price: 110,
            image: "img/product-13.jpeg"
        },
        {
            id: 6,
            name: 'بيتزا كيكه مغطاه بالحليب مغطاه بالبستاشيو',
            name_en: 'Pizza cake covered in milk and topped with pistachios',
            description: 'بيتزا ايس كريم بنكهة البستاشيو و الفستق مصنوع من اجود المكونات  .',
            description_en: 'Pistachio and pistachio flavor ice cream pizza, made from the finest ingredients.',
            price: 130,
            image: "img/product-14.jpeg"
        },
        {
            id: 7,
            name: 'جولدن ايس كريم حليب',
            name_en: 'Golden Ice Cream ',
            description: 'ايس كريم بنكهة الشوكليت مصنوع من اجود المكونات كونو',
            description_en: 'Chocolate flavored ice cream, made from the finest ingredients.',
            price: 110,
            image: "img/product-15.jpeg"
        },
        {
            id: 9,
            name: 'لافندر حليب علي فراوله او علي مانجا',
            name_en: 'Lavender milk on strawberry or mango',
            description: 'ايس كريم بنكهةالفانيليا والمانجا والاستروبري مصنوع من اجود المكونات كب',
            description_en: 'Vanilla, mango, and strawberry flavored ice cream, made from the finest ingredients.',
            price: 55,
            image: "img/product-17.jpeg"
        },
        {
            id: 11,
            name: 'استيك لافلي بطعم التوت',
            name_en: 'Lovely berry-flavored steak',
            description: 'ايس كريم بنكهة الفانيليا والتوت البري المنعش مصنوع من اجود المكونات ',
            description_en: 'Refreshing vanilla and berry flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-20.jpeg"
        },
        {
            id: 12,
            name: 'كندر ايس كريم شوكولاته',
            name_en: 'Kandora chocolate ice cream',
            description: 'ايس كريم بنكهة الكندر مصنوع من اجودالمكونات كونو',
            description_en: 'Kinder flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-21.jpeg"
        },
        {
            id: 13,
            name: 'برجر بسكوته محشيه حليب مغطاه بالشوكولاته',
            name_en: 'Milk-filled biscuit burger covered in chocolate',
            description: 'ايس كريم بنكهة الشوكليت مصنوع من اجود المكونات ',
            description_en: 'Chocolate flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-22.jpeg"
        },
        {
            id: 14,
            name: 'روكيت ايس كريم حليب وبيستاشيو',
            name_en: 'Rocket Ice Cream Milk and Pistachio',
            description: 'ايس كريم بنكهة البستاشيو مصنوع من اجود المكونات',
            description_en: 'Pistachio flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-23.jpeg"
        },
        {
            id: 15,
            name: 'وتش بسكوته محشيه حليب',
            name_en: 'Witch a milk-filled biscuit',
            description: 'ايس كريم بنكهة الفانيليا والاوريو مصنوع من اجود المكونات ',
            description_en: 'Vanilla and Oreo flavored ice cream, made from the finest ingredients.',
            price: 110,
            image: "img/product-24.jpeg"
        },
        {
            id: 16,
            name: 'برجر بسكوته محشيه حليب مغطاه بالبستاشيو',
            name_en: 'burger Milk-filled biscuit topped with pistachios ',
            description: 'ايس كريم بنكهة البستاشيو كندر مصنوع من اجود المكونات ',
            description_en: 'Kinder Pistachio flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-25.jpeg"
        },
        {
            id: 17,
            name: 'جوكر ايس كريم حليب مغطي بالبستاشيو',
            name_en: 'Joker milk ice cream topped with pistachios',
            description: 'ايس كريم بنكهةالبستاشيو مصنوع من اجود المكونات استيك',
            description_en: 'Pistachio flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-26.jpeg"
        },
        {
            id: 18,
            name: 'اتشيز شوكولاته',
            name_en: 'Chocolate cheese',
            description: 'ايس كريم بنكهةالشوكليت مصنوع من اجود المكونات استيك',
            description_en: 'Chocolate flavored ice cream, made from the finest ingredients.',
            price: 160,
            image: "img/product-27.jpeg"
        },
        {
            id: 19,
            name: 'سفن استار بطعم الشوكولاته',
            name_en: 'Seven Stars Chocolate Flavor',
            description: 'ايس كريم بنكهة الفانيليا شوكليت مصنوع من اجود المكونات كونو',
            description_en: 'Vanilla and Chocolate flavored ice cream, made from the finest ingredients.',
            price: 110,
            image: "img/product-28.jpeg"
        },
        {
            id: 20,
            name: 'برستيج بطعم الشوكولاته',
            name_en: 'Prestige with a chocolate flavor',
            description: 'ايس كريم بنكهةالشوكليت مصنوع من اجود المكونات كب',
            description_en: 'Chocolate flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-29.jpeg"
        },
        {
            id: 22,
            name: 'دبي بطعم البستاشيو',
            name_en: 'Dubai with a pistachio flavor',
            description: 'ايس كريم بنكهة البستاشيو مصنوع من اجود المكزنات كونو',
            description_en: 'Pistachio flavored ice cream, made from the finest ingredients.',
            price: 155,
            image: "img/product-1.jpeg"
        },
        {
            id: 23,
            name: 'كريزي حليب علي شوكولاته',
            name_en: 'Crazy Milk on Chocolate',
            description: 'ايس كريم بنكهة الفانيليا شوكليت مصنوع من اجود المكزنات كب',
            description_en: 'Vanilla & Chocolate flavored ice cream, made from the finest ingredients.',
            price: 80,
            image: "img/product-32.jpeg"
        },
        {
            id: 24,
            name: 'ميكس كونو كراميل مغطي بالحليب مغطي بالشوكولاته',
            name_en: 'Mixed caramel cones covered in milk and chocolate',
            description: 'ايس كريم بنكهةالشوكليت والكراميل مضنوع من اجود المكونات',
            description_en: 'Chocolate and Caramel flavored ice cream, made from the finest ingredients.',
            price: 105,
            image: "img/product-33.jpeg"
        },
        {
            id: 25,
            name: 'ماجيستيك مانجو ',
            name_en: 'Majestic Mango ',
            description: 'آيس كريم استيك بنكهة المانجو الطبيعية المنعشة.',
            description_en: 'Refreshing natural mango flavor stick ice cream.',
            price: 105,
            image: "img/product-48.jpeg"
        },
        {
            id: 26,
            name: 'روكيت حليب علي شوكولاته',
            name_en: 'Rocket Milk Chocolate',
            description: 'ساندوتش آيس كريم فاخر من جيلاتو السعادة.',
            description_en: 'Premium ice cream sandwich from Gelato Happiness.',
            price: 105,
            image: "img/product-7.jpeg"
        },
        {
            id: 28,
            name: ' وندر شوكولاتة وفانيلياكونو',
            name_en: 'Wonder Chocolate Vanilla',
            description: 'كونو وندر بمزيج الشوكولاتة والفانيليا.',
            description_en: 'Wonder cone with a blend of chocolate and vanilla.',
            price: 105,
            image: "img/product-34.jpeg"
        },
        {
            id: 29,
            name: 'بيج لافلي بطعم الشوكولاته',
            name_en: 'Big Lovly Chocolate Flavor',
            description: 'كب آيس كريم لافلي بقطع الشوكولاتة.',
            description_en: 'Lovely ice cream cup with chocolate chips.',
            price: 100,
            image: "img/product-35.jpeg"
        },
        {
            id: 30,
            name: 'سوبيا فراولة',
            name_en: 'Sobia Strawberry ',
            description: 'آيس كريم استيك بنكهة السوبيا والفراولة.',
            description_en: 'Sobia and strawberry flavor stick ice cream.',
            price: 110,
            image: "img/product-36.jpeg"
        },
        {
            id: 31,
            name: 'بيج ايس بطعم شوكولاته',
            name_en: 'Big Ice Chocolate Flavor',
            description: 'آيس كريم استيك شوكولاتة غني.',
            description_en: 'Rich chocolate stick ice cream.',
            price: 110,
            image: "img/product-37.jpeg"
        },
        {
            id: 32,
            name: 'اوسكار حليب علي شوكولاته',
            name_en: 'Oscar Milk on Chocolate',
            description: 'كونو أوسكار بنكهة الشوكولاتة الغنية.',
            description_en: 'Oscar cone with rich chocolate flavor.',
            price: 150,
            image: "img/product-38.jpeg"
        },
        {
            id: 33,
            name: 'موزه بطعم الموز',
            name_en: 'Banana-flavored',
            description: 'آيس كريم استيك منعش بطعم الموز.',
            description_en: 'Refreshing banana flavored stick ice cream.',
            price: 110,
            image: "img/product-39.jpeg"
        },
        {
            id: 35,
            name: 'روز حليب علي فراوله او علي مانجا',
            name_en: 'Roze milk on strawberry or mango',
            description: 'كب روز بمزيج الفانيليا والمانجو.',
            description_en: 'Roze cup with a blend of vanilla and mango.',
            price: 105,
            image: "img/product-41.jpeg"
        },
        {
            id: 37,
            name: 'لافلي حليب علي فراوله',
            name_en: 'Lovly milk on strawberries',
            description: 'تشكيلة كب لافلي بنكهات الفواكه المختلفة.',
            description_en: 'Lovely cup assortment with various fruit flavors.',
            price: 105,
            image: "img/product-43.jpeg"
        },
        {
            id: 38,
            name: 'جويل حليب مغطي بالشوكولاته',
            name_en: 'Jewel chocolate-covered milk',
            description: 'آيس كريم جويل استيك مغطى بالشوكولاتة.',
            description_en: 'Jewel stick ice cream coated in chocolate.',
            price: 110,
            image: "img/product-44.jpeg"
        },
        {
            id: 39,
            name: 'استيك لافلي بطعم الشوكولاتة',
            name_en: 'Lovely Chocolate Crunchy Stick',
            description: 'آيس كريم لافلي استيك بالشوكولاتة المقرمشة.',
            description_en: 'Lovely stick ice cream with crunchy chocolate.',
            price: 105,
            image: "img/product-45.jpeg"
        },
        {
            id: 40,
            name: 'ماجستيك حليب مغطي بالشوكولاته',
            name_en: 'Majestic Milk Chocolate Covered',
            description: 'آيس كريم استيك ماجيستيك بالكراميل والمكسرات.',
            description_en: 'Majestic ice cream with caramel and nuts.',
            price: 105,
            image: "img/product-46.jpeg"
        },
        {
            id: 41,
            name: 'ماريو ايس كريم شوكولاته',
            name_en: 'Mario Chocolate Ice Cream',
            description: 'كونو ماريو بنكهة الكوكيز آند كريم.',
            description_en: 'Mario cookies & cream flavored cone.',
            price: 125,
            image: "img/product-47.jpeg"
        },

    ];

    let currentCategoryFilter = 'all';

    function displayProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = '';

        const activeSearch = searchInput ? searchInput.value.toLowerCase() : '';

        const displayedProducts = products.filter(product => {
            const nameAr = product.name.toLowerCase();
            const descAr = product.description.toLowerCase();
            const nameEn = (product.name_en || '').toLowerCase();
            const descEn = (product.description_en || '').toLowerCase();

            // Category Filter
            let matchCategory = false;
            if (currentCategoryFilter === 'all') matchCategory = true;
            else if (currentCategoryFilter === 'stick' && (nameAr.includes('استيك') || descAr.includes('استيك') || nameEn.includes('stick') || descEn.includes('stick'))) matchCategory = true;
            else if (currentCategoryFilter === 'cone' && (nameAr.includes('كونو') || descAr.includes('كونو') || nameAr.includes('ميكسيكونو') || nameAr.includes('بسكويت') || nameEn.includes('cone'))) matchCategory = true;
            else if (currentCategoryFilter === 'cup' && (nameAr.includes('كب') || nameAr.includes('جالون') || nameAr.includes('كوب') || descAr.includes('كب') || nameEn.includes('cup') || nameEn.includes('gallon'))) matchCategory = true;
            else if (currentCategoryFilter === 'chocolate' && (nameAr.includes('شيكولاته') || nameAr.includes('شوكولاته') || nameEn.includes('chocolate'))) matchCategory = true;
            else if (currentCategoryFilter === 'milk' && (nameAr.includes('حليب') || nameEn.includes('milk'))) matchCategory = true;
            else if (currentCategoryFilter === 'pistachio' && (nameAr.includes('بستاشيو') || nameAr.includes('بيستاشيو') || nameAr.includes('فستق') || nameEn.includes('pistachio'))) matchCategory = true;
            else if (currentCategoryFilter === 'mango' && (nameAr.includes('مانجو') || nameEn.includes('mango'))) matchCategory = true;
            else if (currentCategoryFilter === 'strawberry' && (nameAr.includes('فراولة') || nameAr.includes('فراوله') || nameEn.includes('strawberry'))) matchCategory = true;

            // Search Filter
            let matchSearch = true;
            if (activeSearch) {
                matchSearch = (nameAr.includes(activeSearch) || descAr.includes(activeSearch) || nameEn.includes(activeSearch) || descEn.includes(activeSearch));
            }

            return matchCategory && matchSearch;
        });

        displayedProducts.forEach(product => {
            const name = currentLang === "ar" ? product.name : (product.name_en || product.name);
            const description = currentLang === "ar" ? product.description : (product.description_en || product.description);
            const currency = translations[currentLang]?.currency || 'جنية';

            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${name}">
                <div class="product-info">
                    <h3>${name}</h3>
                    <p style="display:none;">${description}</p>
                    <div class="product-price">${product.price.toFixed(3)} ${currency}</div>
                    <button class="btn add-to-cart-btn" data-id="${product.id}">
                        ${currentLang === "ar" ? "أضف إلى السلة" : "Add to Cart"}
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // نظام الترجمة للنصوص الثابتة في الصفحة
    const translations = {
        ar: {
            home: "الرئيسية",
            products: "النكهات",
            about: "عنا",
            contact: "التواصل",
            categories: "تصفح الفئات",
            login: "تسجيل الدخول",
            signup: "إنشاء حساب",
            checkout: "دفع",
            continueShopping: "تسوق المزيد",
            search: "ابحث عن منتج...",
            heroTitle: "مذاق الشرق الأصيل بين يديك!",
            heroDesc: "أشهى المثلجات والحلويات الشرقية الفاخرة",
            discover: "اكتشف منتجاتنا",
            aboutDesc: "نحن في ROYAL CREAMARY متخصصون في تقديم أفضل المثلجات والحلويات الشرقية بطعم أصيل وجودة ممتازة.",
            contactText: "تواصل معنا عبر:",
            featured: "منتجاتنا المميزة",
            cart: "عربة التسوق",
            cartEmpty: "سلة التسوق فارغة.",
            total: "الإجمالي:",
            checkout: "إتمام الشراء",
            rights: "© 2025 ROYAL CREAMARY. جميع الحقوق محفوظة.",
            payment: "طرق الدفع:",
            currency: "جنية",
            checkoutTitle: "إتمام الطلب",
            shippingAddress: "عنوان التوصيل",
            emailLabel: "البريد الإلكتروني",
            emailPlaceholder: "أدخل بريدك الإلكتروني",
            nameLabel: "الاسم",
            namePlaceholder: "أدخل اسمك",
            govLabel: "المحافظة",
            govPlaceholder: "أدخل اسم محافظتك",
            addressLabel: "العنوان",
            addressPlaceholder: "أدخل عنوانك",
            phoneLabel: "الهاتف",
            phonePlaceholder: "أدخل رقم هاتفك",
            paymentMethod: "طريقة الدفع",
            payCod: "الدفع عند الاستلام",
            payVodafone: "فودافون كاش",
            orderSummary: "ملخص الطلب",
            subtotal: "المجموع الفرعي",
            shipping: "الشحن",
            finalTotal: "الإجمالي",
            placeOrder: "إتمام الطلب",
            backToHome: "الرجوع للمتجر",
            featDelivery: "توصيل مبرد وسريع",
            featQuality: "مكونات إيطالية فاخرة",
            featPayment: "الدفع عند الاستلام",
            filterAll: "الكل",
            filterStick: "استيك",
            filterCone: "كونو وبسكويتة",
            filterCup: "عائلي وكب",
            filterChocolate: "شيكولاته",
            filterMilk: "حليب",
            filterPistachio: "بستاشيو",
            filterMango: "مانجو",
            filterStrawberry: "فراولة",
            footerServices: "خدماتنا",
            footerSupport: "مركز الدعم",
            footerTerms: "الشروط والأحكام",
            footerPrivacy: "سياسة الخصوصية",
            footerHelp: "مساعدة",
            footerFAQ: "الأسئلة الشائعة",
            footerQuickLinks: "روابط سريعة",
            footerAccount: "حسابك",
            footerReturn: "الإرجاع والاستبدال",
            footerShipping: "الشحن والتوصيل",
            footerDeliveryTime: "وقت التوصيل المقدر",
            footerPurchaseHistory: "سجل الشراء",
            footerIceCream: "ايس كريم",
            footerCone: "كونو",
            footerStick: "استيك",
            footerBox: "علبة",
            footerSandwich: "سندوتش",
            footerAboutText: "أفضل محل آيس كريم في المدينة. نقدم تشكيلة واسعة من<br>النكهات والعروض الخاصة. زورونا اليوم",
            footerRights: "&copy; Rageh Store. جميع الحقوق محفوظة",
            orderSuccessTitle: "تم استلام طلبك بنجاح!",
            orderSuccessMsg: "شكراً لتسوقك معنا. سنقوم بالتواصل معك قريباً لتأكيد الطلب وشحنه."
        },
        en: {
            home: "Home",
            products: "Flavors",
            about: "About Us",
            contact: "Contact",
            categories: "Browse Categories",
            login: "Login",
            signup: "Sign Up",
            checkout: "Checkout",
            continueShopping: "Shop More",
            search: "Search for a product...",
            heroTitle: "Authentic Eastern Taste in Your Hands!",
            heroDesc: "The finest ice cream and oriental sweets",
            discover: "Discover Our Products",
            aboutDesc: "At ROYAL CREAMARY, we specialize in premium oriental sweets and ice cream with authentic taste and top quality.",
            contactText: "Contact us via:",
            featured: "Featured Products",
            cart: "Shopping Cart",
            cartEmpty: "Your cart is empty.",
            total: "Total:",
            checkout: "Checkout",
            rights: "© 2025 ROYAL CREAMARY. All rights reserved.",
            payment: "Payment Methods:",
            currency: "EGP",
            checkoutTitle: "Complete Order",
            shippingAddress: "Shipping Address",
            emailLabel: "Email",
            emailPlaceholder: "Enter your email",
            nameLabel: "Name",
            namePlaceholder: "Enter your name",
            govLabel: "Governorate",
            govPlaceholder: "Enter your governorate",
            addressLabel: "Address",
            addressPlaceholder: "Enter your address",
            phoneLabel: "Phone",
            phonePlaceholder: "Enter your phone number",
            paymentMethod: "Payment Method",
            payCod: "Cash on Delivery",
            payVodafone: "Vodafone Cash",
            orderSummary: "Order Summary",
            subtotal: "Subtotal",
            shipping: "Shipping",
            finalTotal: "Total",
            placeOrder: "Complete Order",
            backToHome: "Back to Shop",
            featDelivery: "Fast Chilled Delivery",
            featQuality: "Premium Ingredients",
            featPayment: "Cash on Delivery",
            filterAll: "All",
            filterStick: "Stick",
            filterCone: "Cone & Biscuit",
            filterCup: "Cup & Family",
            filterChocolate: "Chocolate",
            filterMilk: "Milk",
            filterPistachio: "Pistachio",
            filterMango: "Mango",
            filterStrawberry: "Strawberry",
            footerServices: "Our Services",
            footerSupport: "Support Center",
            footerTerms: "Terms & Conditions",
            footerPrivacy: "Privacy Policy",
            footerHelp: "Help",
            footerFAQ: "FAQ",
            footerQuickLinks: "Quick Links",
            footerAccount: "Your Account",
            footerReturn: "Returns & Exchanges",
            footerShipping: "Shipping & Delivery",
            footerDeliveryTime: "Estimated Delivery",
            footerPurchaseHistory: "Purchase History",
            footerIceCream: "Ice Cream",
            footerCone: "Cone",
            footerStick: "Stick",
            footerBox: "Box",
            footerSandwich: "Sandwich",
            footerAboutText: "Best ice cream shop in town. We offer a wide variety of<br>flavors and special offers. Visit us today",
            footerRights: "&copy; Rageh Store. All rights reserved",
            orderSuccessTitle: "Order Received Successfully!",
            orderSuccessMsg: "Thank you for shopping with us. We will contact you soon to confirm and ship your order."
        },
    };
    // دالة لتطبيق اللغة المختارة على الصفحة
    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

        // Update active class on menu items instead of changing title
        const langItems = document.querySelectorAll(".lang-menu li");
        langItems.forEach(item => {
            if (item.getAttribute("data-lang") === lang) {
                item.style.color = "var(--primary-color)";
            } else {
                item.style.color = "var(--text-dark)";
            }
        });

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        localStorage.setItem("lang", lang);
    }

    // دالة لتحديث عرض سلة التسوق
    function updateCartDisplay() {
        let total = 0;

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';

            if (cart.length === 0) {
                const emptyText = translations[currentLang]?.cartEmpty || 'سلة التسوق فارغة.';
                cartItemsContainer.innerHTML = `<p style="text-align: center; color: #777;">${emptyText}</p>`;
            } else {
                cart.forEach(item => {
                    const name = currentLang === "ar" ? item.name : (item.name_en || item.name);
                    const currency = translations[currentLang]?.currency || 'جنية';

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    cartItemElement.innerHTML = `
                        <img src="${item.image}" alt="${name}">
                        <div class="item-info-container">
                            <div class="item-details">
                                <h4>${name}</h4>
                                <p>${item.price.toFixed(3)} ${currency}</p>
                            </div>
                            <div class="item-actions-row">
                                <div class="item-quantity">
                                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="increase-quantity" data-id="${item.id}">+</button>
                                </div>
                                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                    total += item.price * item.quantity;
                });
            }
            if (cartTotalSpan) cartTotalSpan.textContent = total.toFixed(3);
        }

        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart));

        // إذا كنا في صفحة الدفع، نقوم بتحديث ملخص الطلب أيضاً
        if (typeof renderCheckoutItems === 'function' && document.getElementById('checkout-section')) {
            renderCheckoutItems();
        }
    }

    // إضافة منتج إلى السلة
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartDisplay();
        }
    }

    // تعديل كمية المنتج في السلة
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            updateCartDisplay();
        }
    }

    // إزالة منتج من السلة
    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }

    // فتح وإغلاق سلة التسوق
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            if (cartModal) {
                cartModal.classList.add('active');
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    if (closeButton && cartModal) {
        closeButton.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn && cartModal) {
        continueShoppingBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    // إغلاق المودال عند النقر خارج المحتوى
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    // ========== منطق صفحة الدفع Checkout ==========
    const checkoutSection = document.getElementById('checkout-section');
    const checkoutItemsList = document.getElementById('checkoutItemsList');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutFinalTotal = document.getElementById('checkoutFinalTotal');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');

    function renderCheckoutItems() {
        if (!checkoutItemsList) return;
        checkoutItemsList.innerHTML = '';

        if (cart.length === 0) {
            checkoutItemsList.innerHTML = `
                <div class="empty-cart-msg" style="text-align: center; padding: 20px 0;">
                    <p data-i18n="cartEmpty" style="font-size: 1.2rem; margin-bottom: 20px; font-weight: bold; color: #777;">عربتك فارغة</p>
                    <button class="shop-now-btn" onclick="window.location.href='index.html'" data-i18n="continueShopping">تسوق الآن</button>
                </div>
            `;
            checkoutSubtotal.textContent = "0";
            document.getElementById('checkoutShipping').textContent = "0";
            checkoutFinalTotal.textContent = "0";

            const submitBtn = document.querySelector('.place-order-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
            }
            return;
        }

        let subtotal = 0;
        const shipping = 20;

        cart.forEach(item => {
            const name = currentLang === "ar" ? item.name : (item.name_en || item.name);
            const currency = translations[currentLang]?.currency || 'EGP';

            const div = document.createElement('div');
            div.classList.add('checkout-item');
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
                    <img src="${item.image}" alt="${name}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;">
                    <div class="checkout-item-details" style="flex-grow: 1; margin: 0;">
                        <h4>${name}</h4>
                        <p>${item.price.toFixed(3)} ${currency}</p>
                    </div>
                </div>
                <div class="chk-qty-controls">
                    <button type="button" class="chk-decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="chk-increase" data-id="${item.id}">+</button>
                </div>
            `;
            checkoutItemsList.appendChild(div);
            subtotal += item.price * item.quantity;
        });

        checkoutSubtotal.textContent = subtotal.toFixed(3);
        const shippingEl = document.getElementById('checkoutShipping');
        if (shippingEl) shippingEl.textContent = shipping.toFixed(3);
        checkoutFinalTotal.textContent = (subtotal + shipping).toFixed(3);

        const submitBtn = document.querySelector('.place-order-btn');
        if (submitBtn) submitBtn.disabled = false;
    }

    if (checkoutItemsList) {
        checkoutItemsList.addEventListener('click', (e) => {
            const increaseBtn = e.target.closest('.chk-increase');
            const decreaseBtn = e.target.closest('.chk-decrease');

            if (increaseBtn) {
                updateQuantity(parseInt(increaseBtn.dataset.id), 1);
                renderCheckoutItems();
            } else if (decreaseBtn) {
                updateQuantity(parseInt(decreaseBtn.dataset.id), -1);
                renderCheckoutItems();
            }
        });
    }

    function openCheckout() {
        if (document.getElementById('checkout-section')) {
            // نحن بالفعل في صفحة الدفع، فقط نغلق السلة
            if (cartModal) cartModal.classList.remove('active');
        } else {
            window.location.href = 'checkout.html';
        }
    }

    function closeCheckout() {
        window.location.href = 'index.html';
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }

    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', closeCheckout);
    }

    // Close checkout when navigating away via header links
    const headerLinks = document.querySelectorAll('header nav ul li a, .logo-img');
    headerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (checkoutSection) {
                closeCheckout();
            }
        });
    });

    const checkoutForm = document.getElementById('checkoutForm');

    // ========== دالة إظهار وإخفاء تفاصيل المحافظ الإلكترونية ==========
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const mobileWalletDetails = document.getElementById('mobileWalletDetails');
    const transactionNumberInput = document.getElementById('transactionNumber');

    if (paymentRadios.length > 0 && mobileWalletDetails && transactionNumberInput) {
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'vodafone' || e.target.value === 'instapay') {
                    mobileWalletDetails.style.display = 'block';
                    transactionNumberInput.required = true;
                } else {
                    mobileWalletDetails.style.display = 'none';
                    transactionNumberInput.required = false;
                    transactionNumberInput.value = ''; // تفريغ الحقل إذا تراجع عن الاختيار
                    transactionNumberInput.style.borderColor = '#ddd'; // إعادة اللون الأصلي
                }
            });
        });

        // منع الحروف وإضافة لون للتنبيه (أحمر لو مش 6 أرقام، أخضر لو صح)
        transactionNumberInput.addEventListener('input', (e) => {
            // السماح بالأرقام فقط
            e.target.value = e.target.value.replace(/[^0-9]/g, '');

            if (e.target.value.length === 6) {
                e.target.style.borderColor = '#1ba97f'; // أخضر
                e.target.style.boxShadow = '0 0 5px rgba(27, 169, 127, 0.3)';
            } else if (e.target.value.length > 0) {
                e.target.style.borderColor = '#e60000'; // أحمر
                e.target.style.boxShadow = '0 0 5px rgba(230, 0, 0, 0.2)';
            } else {
                e.target.style.borderColor = '#ddd';
                e.target.style.boxShadow = 'none';
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const name = document.getElementById("fullName").value;
            const governorate = document.getElementById("governorate").value;
            const address = document.getElementById("address").value;
            const phone = document.getElementById("phone").value;

            const paymentMethodInput = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = paymentMethodInput ? paymentMethodInput.value : '';
            const transactionNumber = (document.getElementById("transactionNumber")?.value || '').trim();

            // التحقق من رقم العملية (لازم 6 أرقام للفودافون وانستا باي)
            if ((paymentMethod === 'vodafone' || paymentMethod === 'instapay')) {
                if (transactionNumber.length === 0) {
                    alert(currentLang === 'ar' ? 'برجاء إدخال رقم العملية أولاً.' : 'Please enter the transaction number first.');
                    document.getElementById("transactionNumber").focus();
                    const btn = document.querySelector('.place-order-btn');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = currentLang === 'ar' ? 'إتمام الطلب' : 'Place Order';
                    }
                    return;
                }
                if (transactionNumber.length !== 6 || !/^\d+$/.test(transactionNumber)) {
                    alert(currentLang === 'ar' ? 'عفواً، يجب كتابة 6 أرقام صحيحة لرقم العملية.' : 'Please enter exactly 6 digits for the transaction number.');
                    document.getElementById("transactionNumber").focus();
                    const btn = document.querySelector('.place-order-btn');
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = currentLang === 'ar' ? 'إتمام الطلب' : 'Place Order';
                    }
                    return;
                }
            }

            // تجميع المنتجات في نص واحد (تحت بعض)
            const productsString = cart.map(item => {
                const itemName = currentLang === 'ar' ? item.name : (item.name_en || item.name);
                return itemName + ' (x' + item.quantity + ')';
            }).join('\n');

            const finalTotal = document.getElementById("checkoutFinalTotal") ? document.getElementById("checkoutFinalTotal").textContent : '0';


            const now = new Date();
            const dateStr = now.toLocaleDateString('ar-EG') + ' ' + now.toLocaleTimeString('ar-EG');
            const paymentLabels = { cod: 'الدفع عند الاستلام', vodafone: 'فودافون كاش', instapay: 'Instapay' };

            const orderData = {
                date: dateStr,
                name: name,
                phone: phone,
                governorate: governorate,
                address: address,
                email: email,
                products: productsString,
                paymentMethod: paymentLabels[paymentMethod] || paymentMethod,
                transactionNumber: transactionNumber || '-',
                total: finalTotal
            };

            // منع النقر المتعدد (استخدام سيلكتور مباشر لأن الزر بره الفورم في التصميم)
            const submitBtn = document.querySelector('.place-order-btn');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = currentLang === 'ar' ? '<i class="fas fa-spinner fa-spin"></i> جاري معالجة طلبك...' : '<i class="fas fa-spinner fa-spin"></i> Processing...';

                // خطة بديلة: لو الطلب خد أكتر من 10 ثواني، نرجع الزرار شغال عشان العميل ما يتحبسش
                setTimeout(() => {
                    if (submitBtn && submitBtn.disabled) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }, 10000);
            }

            // إرسال البيانات لجوجل شيت عبر GET request باستخدام fetch
            var SHEET_URL = 'https://script.google.com/macros/s/AKfycbyeiywVmmWOa2JTQxGVrXCvEh6fthENfziR3r9jdok2L_Ep1QJ913DEBmDuLnCf2mdQ/exec';

            var params = Object.keys(orderData).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(orderData[key]);
            }).join('&');

            fetch(SHEET_URL + '?' + params, { mode: 'no-cors' })
                .then(function () {
                    const successModal = document.getElementById('success-modal');
                    if (successModal) {
                        successModal.classList.add('active');
                        // نعدل الزرار داخل المودال عشان يمسح السلة ويقفل الشيك اوت
                        const backBtn = successModal.querySelector('.back-to-home-btn');
                        if (backBtn) {
                            backBtn.addEventListener('click', () => {
                                successModal.classList.remove('active');
                                cart = [];
                                localStorage.removeItem('cart');
                                updateCartDisplay();
                                closeCheckout();
                            });
                        }
                    } else {
                        alert(currentLang === 'ar' ? 'تم استلام طلبك بنجاح !' : 'Order placed and saved to Google Sheet!');
                        cart = [];
                        localStorage.removeItem('cart');
                        updateCartDisplay();
                        closeCheckout();
                    }
                })
                .catch(function (err) {
                    console.error('Error:', err);
                    const successModal = document.getElementById('success-modal');
                    if (successModal) {
                        successModal.classList.add('active');
                        const backBtn = successModal.querySelector('.back-to-home-btn');
                        if (backBtn) {
                            backBtn.addEventListener('click', () => {
                                successModal.classList.remove('active');
                                cart = [];
                                updateCartDisplay();
                                closeCheckout();
                            });
                        }
                    } else {
                        alert(currentLang === 'ar' ? 'تم استلام طلبك!' : 'Order received!');
                        cart = [];
                        updateCartDisplay();
                        closeCheckout();
                    }
                });
        });
    }


    // ========== Initialize Checkout Page if present ==========
    if (checkoutSection) {
        renderCheckoutItems();
    }


    // معالجة النقر على أزرار إضافة/تعديل/حذف المنتجات
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            }
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const increaseBtn = e.target.closest('.increase-quantity');
            const decreaseBtn = e.target.closest('.decrease-quantity');
            const removeBtn = e.target.closest('.remove-item');

            if (increaseBtn) {
                updateQuantity(parseInt(increaseBtn.dataset.id), 1);
            } else if (decreaseBtn) {
                updateQuantity(parseInt(decreaseBtn.dataset.id), -1);
            } else if (removeBtn) {
                removeItemFromCart(parseInt(removeBtn.dataset.id));
            }
        });
    }


    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            displayProducts(); // Relies on the updated displayProducts logic
        });
    }

    const filterOptions = document.querySelectorAll(".filter-option");
    if (filterOptions) {
        filterOptions.forEach(opt => {
            opt.addEventListener("click", (e) => {
                e.stopPropagation();
                filterOptions.forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                currentCategoryFilter = e.target.getAttribute("data-filter");
                displayProducts();

                // Close the dropdown after selection
                const parentBtn = e.target.closest('.categories-btn') || e.target.closest('.flavors-btn');
                if (parentBtn) parentBtn.classList.remove('active');

                // التمرير مباشرة لأسفل قسم المنتجات
                const productsSection = document.getElementById("products");
                if (productsSection) {
                    const offset = productsSection.offsetTop - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            });
        });
    }

    /* ===== Slider Script ===== */
    const slides = document.querySelectorAll(".slide");
    const enterBtn = document.querySelector(".enter-site-btn");
    let currentSlide = 0;

    function changeSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }

    // تغيير الصورة كل 3 ثواني
    if (slides.length > 0) setInterval(changeSlide, 3000);

    // زر الانتقال للموقع
    if (enterBtn) {
        enterBtn.addEventListener("click", function () {
            document.querySelector("header").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    // New Hero Slider logic
    const heroSlides = document.querySelectorAll(".hero-slide");
    let currentHeroSlide = 0;
    if (heroSlides.length > 0) {
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove("active");
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add("active");
        }, 3000);
    }

    // ========== Smooth Scrolling & Navigation Fixes ==========
    const navLinks = document.querySelectorAll('header nav ul li a, .logo-img');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.tagName === 'A' ? link.getAttribute('href') : '#home';

            // If we are on checkout page and click on a nav link or logo
            if (document.getElementById('checkout-section')) {
                e.preventDefault();
                window.location.href = 'index.html' + (href && href.startsWith('#') ? href : '');
                return;
            }

            // Smooth scroll for internal links on the same page
            if (href && href.startsWith('#')) {
                e.preventDefault();
                if (href === '#home') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    const langDropdown = document.querySelector(".lang-dropdown");
    const langMenu = document.getElementById("langMenu");

    if (langToggle && langDropdown) {
        langToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle("active");
        });
    }

    document.addEventListener("click", () => {
        if (langDropdown && langDropdown.classList.contains("active")) {
            langDropdown.classList.remove("active");
        }
    });

    if (langMenu) {
        langMenu.addEventListener("click", (e) => {
            if (e.target.tagName === "LI") {
                const selectedLang = e.target.getAttribute("data-lang");
                if (selectedLang !== currentLang) {
                    currentLang = selectedLang;
                    localStorage.setItem("lang", currentLang); // Save language persistently
                    applyLanguage(currentLang);
                    displayProducts();
                    if (typeof renderCheckoutItems === 'function') renderCheckoutItems(); // Update checkout UI
                    updateCartDisplay();
                }
                langDropdown.classList.remove("active");
            }
        });
    }

    applyLanguage(currentLang);

    // تهيئة الصفحة عند التحميل
    displayProducts();
    updateCartDisplay();
});
