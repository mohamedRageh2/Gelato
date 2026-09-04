document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.querySelector('.cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalSpan = document.querySelector('.cart-total');

    // ===== Dark Mode =====
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedDarkMode = localStorage.getItem('darkMode');

    // Apply saved preference on load
    if (savedDarkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // ===== Dropdown Toggle Logic =====
    function setupDropdown(btnSelector, dropdownSelector, otherBtnSelector) {
        const btn = document.querySelector(btnSelector);
        const otherBtn = document.querySelector(otherBtnSelector);
        if (!btn) return;

        btn.addEventListener('click', function (e) {
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
    document.addEventListener('click', function () {
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
            price: 110,
            image: "img/product-9.jpeg",
            carton: 12
        },
        {
            id: 5,
            name: 'فسدقة حليب مغطي بالبستاشيو',
            name_en: 'Pistachio milk topped with pistachios',
            description: 'آيس كريم منعش بنكهة الفانيليا والشوكليت استيك.',
            description_en: 'Refreshing vanilla and chocolate flavored ice cream.',
            price: 115,
            image: "img/product-13.jpeg",
            carton: 25
        },
        {
            id: 6,
            name: 'بيتزا كيكه مغطاه بالحليب مغطاه بالبستاشيو',
            name_en: 'Pizza cake covered in milk and topped with pistachios',
            description: 'بيتزا ايس كريم بنكهة البستاشيو و الفستق مصنوع من اجود المكونات  .',
            description_en: 'Pistachio and pistachio flavor ice cream pizza, made from the finest ingredients.',
            price: 135,
            image: "img/product-14.jpeg",
            carton: 6
        },
        {
            id: 7,
            name: 'جولدن ايس كريم',
            name_en: 'Golden Ice Cream',
            description: 'ايس كريم جولدن كونو بنكهات رائعة',
            description_en: 'Golden cone ice cream in great flavors.',
            price: 115,
            image: "img/product-15.jpeg",
            carton: 25,
            flavors: [
                { id: 'milk', name_ar: 'حليب', name_en: 'Milk', image: 'img/product-15.jpeg' },
                { id: 'mango', name_ar: 'مانجو', name_en: 'Mango', image: 'img/product-58.jpeg' },
                { id: 'straw', name_ar: 'فراولة', name_en: 'Strawberry', image: 'img/product-59.jpeg' }
            ]
        },

        {
            id: 11,
            name: 'استيك لافلي',
            name_en: 'Lovely Steak',
            description: 'ايس كريم بنكهة الفانيليا والتوت البري أو الشوكولاتة المقرمشة',
            description_en: 'Refreshing vanilla and berry or crunchy chocolate flavored ice cream.',
            price: 110,
            image: "img/product-20.jpeg",
            carton: 12,
            flavors: [
                { id: 'berry', name_ar: 'توت', name_en: 'Berry', image: 'img/product-20.jpeg' },
                { id: 'choc', name_ar: 'شوكولاتة', name_en: 'Chocolate', image: 'img/product-45.jpeg' }
            ]
        },
        {
            id: 13,
            name: 'برجر بسكوتة',
            name_en: 'Biscuit Burger',
            description: 'ايس كريم برجر بسكوتة محشية حليب بنكهات رائعة',
            description_en: 'Milk-filled biscuit burger ice cream in great flavors.',
            price: 110,
            image: "img/product-22.jpeg",
            carton: 12,
            flavors: [
                { id: 'choc', name_ar: 'شوكولاتة', name_en: 'Chocolate', image: 'img/product-22.jpeg' },
                { id: 'pist', name_ar: 'بستاشيو', name_en: 'Pistachio', image: 'img/product-25.jpeg' }
            ]
        },

        {
            id: 15,
            name: 'وتش بسكوته محشيه حليب',
            name_en: 'Witch a milk-filled biscuit',
            description: 'ايس كريم بنكهة الفانيليا والاوريو مصنوع من اجود المكونات ',
            description_en: 'Vanilla and Oreo flavored ice cream, made from the finest ingredients.',
            price: 115,
            image: "img/product-24.jpeg",
            carton: 25
        },

        {
            id: 17,
            name: 'جوكر ايس كريم حليب مغطي بالبستاشيو',
            name_en: 'Joker milk ice cream topped with pistachios',
            description: 'ايس كريم بنكهةالبستاشيو مصنوع من اجود المكونات استيك',
            description_en: 'Pistachio flavored ice cream, made from the finest ingredients.',
            price: 110,
            image: "img/product-26.jpeg",
            carton: 12
        },
        {
            id: 18,
            name: 'تشيز (كيك)',
            name_en: 'Cheese (Cake)',
            description: 'ايس كريم تشيز بمزيج رائع من النكهات',
            description_en: 'Cheese ice cream with a great blend of flavors.',
            price: 165,
            image: "img/product-27.jpeg",
            carton: 12,
            flavors: [
                { id: 'choc', name_ar: 'شوكولاتة', name_en: 'Chocolate', image: 'img/product-27.jpeg' },
                { id: 'straw', name_ar: 'فراولة', name_en: 'Strawberry', image: 'img/product-52.jpeg' }
            ]
        },
        {
            id: 19,
            name: 'سفن استار بطعم الشوكولاته',
            name_en: 'Seven Stars Chocolate Flavor',
            description: 'ايس كريم بنكهة الفانيليا شوكليت مصنوع من اجود المكونات كونو',
            description_en: 'Vanilla and Chocolate flavored ice cream, made from the finest ingredients.',
            price: 115,
            image: "img/product-28.jpeg",
            carton: 25
        },

        {
            id: 22,
            name: 'دبي بطعم البستاشيو',
            name_en: 'Dubai with a pistachio flavor',
            description: 'ايس كريم بنكهة البستاشيو مصنوع من اجود المكزنات كونو',
            description_en: 'Pistachio flavored ice cream, made from the finest ingredients.',
            price: 160,
            image: "img/product-49.jpeg",
            carton: 12
        },
        {
            id: 24,
            name: 'مكس كونو كراميل مغطي بالحليب مغطي بالشوكولاته',
            name_en: 'Mixed caramel cones covered in milk and chocolate',
            description: 'ايس كريم بنكهةالشوكليت والكراميل مضنوع من اجود المكونات',
            description_en: 'Chocolate and Caramel flavored ice cream, made from the finest ingredients.',
            price: 110,
            image: "img/product-33.jpeg",
            carton: 12
        },
        {
            id: 25,
            name: 'ماجيستيك',
            name_en: 'Majestic',
            description: 'آيس كريم استيك ماجيستيك متوفر بنكهات رائعة.',
            description_en: 'Majestic stick ice cream available in great flavors.',
            price: 110,
            image: "img/product-48.jpeg",
            carton: 12,
            flavors: [
                { id: 'mango', name_ar: 'مانجو', name_en: 'Mango', image: 'img/product-48.jpeg' },
                { id: 'choc', name_ar: 'شوكولاتة', name_en: 'Chocolate', image: 'img/product-46.jpeg' },
                { id: 'straw', name_ar: 'فراولة', name_en: 'Strawberry', image: 'img/product-40.jpeg' }
            ]
        },

        {
            id: 31,
            name: 'بيج ايس بطعم شوكولاته',
            name_en: 'Big Ice Chocolate Flavor',
            description: 'آيس كريم استيك شوكولاتة غني.',
            description_en: 'Rich chocolate stick ice cream.',
            price: 115,
            image: "img/product-37.jpeg",
            carton: 25
        },

        {
            id: 33,
            name: 'موزه بطعم الموز',
            name_en: 'Banana-flavored',
            description: 'آيس كريم استيك منعش بطعم الموز.',
            description_en: 'Refreshing banana flavored stick ice cream.',
            price: 115,
            image: "img/product-39.jpeg",
            carton: 25
        },
        {
            id: 38,
            name: 'جويل حليب مغطي بالشوكولاته',
            name_en: 'Jewel chocolate-covered milk',
            description: 'آيس كريم جويل استيك مغطى بالشوكولاتة.',
            description_en: 'Jewel stick ice cream coated in chocolate.',
            price: 115,
            image: "img/product-44.jpeg",
            carton: 25
        },


        {
            id: 41,
            name: 'ماريو ايس كريم شوكولاته',
            name_en: 'Mario Chocolate Ice Cream',
            description: 'كونو ماريو بنكهة الكوكيز آند كريم.',
            description_en: 'Mario cookies & cream flavored cone.',
            price: 110,
            image: "img/product-47.jpeg",
            carton: 12
        },
        {
            id: 42,
            name: 'ماجستيك ذهبي',
            name_en: 'Majestic Gold',
            description: 'كونو ماريو بنكهة الكوكيز آند كريم.',
            description_en: 'Mario cookies & cream flavored cone.',
            price: 220,
            image: "img/product-50.jpeg",
            carton: 12
        },


        {
            id: 44,
            name: 'Vip حليب علي بستاشيو',
            name_en: 'VIP milk on pistachio',
            description: 'كونو ماريو بنكهة الكوكيز آند كريم.',
            description_en: 'Mario cookies & cream flavored cone.',
            price: 220,
            image: "img/product-53.jpeg",
            carton: 12
        },
        {
            id: 45,
            name: 'لافلي حليب',
            name_en: 'Lovely Milk',
            description: 'كونو ماريو بنكهة الكوكيز آند كريم.',
            description_en: 'Mario cookies & cream flavored cone.',
            price: 165,
            image: "img/product-54.jpeg",
            carton: 12,
            flavors: [
                { id: 'straw', name_ar: 'فراولة', name_en: 'Strawberry', image: 'img/product-54.jpeg' },
                { id: 'mango', name_ar: 'مانجو', name_en: 'Mango', image: 'img/product-55.jpeg' }
            ]
        },
        {
            id: 47,
            name: 'استيك بطعم البطيخ',
            name_en: 'watermelon flavor stick ice cream',
            description: 'كونو ماريو بنكهة الكوكيز آند كريم.',
            description_en: 'Mario cookies & cream flavored cone.',
            price: 115,
            image: "img/product-56.jpeg",
            carton: 25
        },
        {
            id: 50,
            name: 'روز',
            name_en: 'Roze',
            description: 'روز.',
            description_en: 'Roze.',
            price: 110,
            image: "img/product-41.jpeg",
            carton: 12,
            flavors: [
                { id: 'mango', name_ar: 'مانجو', name_en: 'Mango' },
                { id: 'straw', name_ar: 'فراولة', name_en: 'Strawberry' }
            ]
        },
        {
            id: 50,
            name: 'كندر',
            name_en: 'kinder',
            description: ';كندر',
            description_en: 'kinder.',
            price: 110,
            image: "img/product-21.jpeg",
            carton: 12,
        },
        {
            id: 48,
            name: 'جالون 3 لتر عائلي',
            name_en: '3 liter family gallon',
            description: 'جالون 3 لتر عائلي بنكهات متعددة',
            description_en: '3 liter family gallon in multiple flavors.',
            price: 105,
            image: "img/product-57.jpeg",
            flavors: [
                { id: 'milk', name_ar: 'حليب', name_en: 'Milk', price: 105 },
                { id: 'choc', name_ar: 'شوكولاتة', name_en: 'Chocolate', price: 115 },
                { id: 'mango', name_ar: 'مانجو', name_en: 'Mango', price: 100 },
                { id: 'straw', name_ar: 'فراولة', name_en: 'Strawberry', price: 100 }
            ]
        },
        {
            id: 51,
            name: 'فووب استيك',
            name_en: ' Stick foop',
            description: 'آيس كريم استيك فوب متوفر بنكهتي التوت والليمون نعناع.',
            description_en: 'Vop stick ice cream available in berry and lemon mint flavors.',
            price: 115,
            image: "img/product-61.jpeg",
            carton: 25,
            flavors: [
                { id: 'berry', name_ar: 'توت', name_en: 'Berry', image: 'img/product-61.jpeg' },
                { id: 'mint', name_ar: 'ليمون نعناع', name_en: 'Lemon Mint', image: 'img/product-60.jpeg' }
            ]
        },
        {
            id: 52,
            name: 'زووم مانجا',
            name_en: 'Zoom Mango',
            description: 'آيس كريم بنكهة المانجو المنعشة.',
            description_en: 'Refreshing mango flavored ice cream.',
            price: 115,
            image: "img/product-62.jpeg",
            carton: 25
        }
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
            let hasFlavor = (fId) => product.flavors && product.flavors.some(f => f.id === fId);

            if (currentCategoryFilter === 'all') matchCategory = true;
            else if (currentCategoryFilter === 'stick' && (nameAr.includes('استيك') || descAr.includes('استيك') || nameEn.includes('stick') || descEn.includes('stick'))) matchCategory = true;
            else if (currentCategoryFilter === 'cone' && (nameAr.includes('كونو') || descAr.includes('كونو') || nameAr.includes('ميكسيكونو') || nameAr.includes('بسكويت') || nameEn.includes('cone'))) matchCategory = true;
            else if (currentCategoryFilter === 'cup' && (nameAr.includes('كب') || nameAr.includes('جالون') || nameAr.includes('كوب') || descAr.includes('كب') || nameEn.includes('cup') || nameEn.includes('gallon'))) matchCategory = true;
            else if (currentCategoryFilter === 'chocolate' && (nameAr.includes('شيكولاته') || nameAr.includes('شوكولاته') || nameEn.includes('chocolate') || hasFlavor('choc'))) matchCategory = true;
            else if (currentCategoryFilter === 'milk' && (nameAr.includes('حليب') || nameEn.includes('milk') || hasFlavor('milk'))) matchCategory = true;
            else if (currentCategoryFilter === 'pistachio' && (nameAr.includes('بستاشيو') || nameAr.includes('بيستاشيو') || nameAr.includes('فستق') || nameEn.includes('pistachio') || hasFlavor('pist'))) matchCategory = true;
            else if (currentCategoryFilter === 'mango' && (nameAr.includes('مانجو') || nameEn.includes('mango') || hasFlavor('mango'))) matchCategory = true;
            else if (currentCategoryFilter === 'strawberry' && (nameAr.includes('فراولة') || nameAr.includes('فراوله') || nameEn.includes('strawberry') || hasFlavor('straw'))) matchCategory = true;

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

            let flavorsHtml = '';
            let displayPrice = product.price;
            const flavorColors = {
                'choc': '#6B3A2A',
                'straw': '#E84057',
                'mango': '#F5A623',
                'milk': '#D4A76A',
                'berry': '#8B3A8B',
                'mint': '#2ECC71',
                'pist': '#6B9B37',
                'caramel': '#C68E3C',
                'vanilla': '#F3E5AB'
            };
            let displayImage = product.image;
            if (product.flavors && product.flavors.length > 0) {
                // Determine which flavor should be active based on filter
                let targetFlavorId = null;
                if (currentCategoryFilter === 'chocolate') targetFlavorId = 'choc';
                else if (currentCategoryFilter === 'milk') targetFlavorId = 'milk';
                else if (currentCategoryFilter === 'pistachio') targetFlavorId = 'pist';
                else if (currentCategoryFilter === 'mango') targetFlavorId = 'mango';
                else if (currentCategoryFilter === 'strawberry') targetFlavorId = 'straw';

                let activeFlavorIndex = 0;
                if (targetFlavorId) {
                    const idx = product.flavors.findIndex(f => f.id === targetFlavorId);
                    if (idx > -1) activeFlavorIndex = idx;
                }

                if (product.flavors[activeFlavorIndex].price) {
                    displayPrice = product.flavors[activeFlavorIndex].price;
                }
                if (product.flavors[activeFlavorIndex].image) {
                    displayImage = product.flavors[activeFlavorIndex].image;
                }

                flavorsHtml = '<div class="product-flavors">';
                product.flavors.forEach((flavor, index) => {
                    const flavorName = currentLang === 'ar' ? flavor.name_ar : flavor.name_en;
                    const activeClass = index === activeFlavorIndex ? 'active' : '';
                    const flavorPrice = flavor.price || product.price;
                    const fColor = flavorColors[flavor.id] || 'var(--primary-color)';
                    const btnStyle = index === activeFlavorIndex
                        ? `background-color: ${fColor}; color: #fff; border-color: ${fColor};`
                        : `color: ${fColor}; border-color: ${fColor}; background-color: transparent;`;
                    flavorsHtml += `<button class="flavor-btn ${activeClass}" data-flavor-id="${flavor.id}" data-flavor-name-ar="${flavor.name_ar}" data-flavor-name-en="${flavor.name_en}" data-flavor-price="${flavorPrice}" data-flavor-color="${fColor}" data-flavor-image="${flavor.image || ''}" style="${btnStyle}" onclick="selectFlavor(this)">${flavorName}</button>`;
                });
                flavorsHtml += '</div>';
            }

            const cartonText = product.carton
                ? (currentLang === 'ar' ? `🎁 الكرتونة: ${product.carton} قطعة` : `🎁 Carton: ${product.carton} pcs`)
                : '';
            const cartonHtml = cartonText ? `<div class="product-carton">${cartonText}</div>` : '';

            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${displayImage}" alt="${name}">
                <div class="product-info">
                    <h3>${name}</h3>
                    ${cartonHtml}
                    <p style="display:none;">${description}</p>
                    <div class="product-price">${Math.round(displayPrice)} ${currency}</div>
                    ${flavorsHtml}
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
            emailLabel: "البريد الإلكتروني (اختياري)",
            emailPlaceholder: "أدخل بريدك الإلكتروني (اختياري)",
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
            footerRights: "&copy; 2026 Gelato Happiness. جميع الحقوق محفوظة",
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
            emailLabel: "Email (Optional)",
            emailPlaceholder: "Enter your email (Optional)",
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
            footerRights: "&copy; 2026 Gelato Happiness. All rights reserved",
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
                    let name = currentLang === "ar" ? item.name : (item.name_en || item.name);
                    if (item.selectedFlavor) {
                        const flavorName = currentLang === 'ar' ? item.selectedFlavor.name_ar : item.selectedFlavor.name_en;
                        name += ` (${flavorName})`;
                    }
                    const currency = translations[currentLang]?.currency || 'جنية';

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    cartItemElement.innerHTML = `
                        <img src="${item.image}" alt="${name}">
                        <div class="item-info-container">
                            <div class="item-details">
                                <h4>${name}</h4>
                                <p>${Math.round(item.price)} ${currency}</p>
                            </div>
                            <div class="item-actions-row" style="display: flex; align-items: center; gap: 12px; justify-content: flex-start;">
                                <div class="item-quantity">
                                    <button class="decrease-quantity" data-id="${item.cartId || item.id}">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="increase-quantity" data-id="${item.cartId || item.id}">+</button>
                                </div>
                                <button class="remove-item" data-id="${item.cartId || item.id}" title="حذف المنتج"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                    total += item.price * item.quantity;
                });
            }
            if (cartTotalSpan) cartTotalSpan.textContent = Math.round(total);
        }

        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart));

        // إذا كنا في صفحة الدفع، نقوم بتحديث ملخص الطلب أيضاً
        if (typeof renderCheckoutItems === 'function' && document.getElementById('checkout-section')) {
            renderCheckoutItems();
        }
    }

    // ===== Toast Notification =====
    let toastTimeout = null;
    function showToast(productName) {
        let toast = document.getElementById('cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }

        const msg = currentLang === 'ar'
            ? `تمت إضافة ${productName} إلى السلة`
            : `${productName} added to cart`;

        toast.innerHTML = `<span class="toast-icon">✓</span> ${msg}`;

        // Reset: remove show class, force reflow, then add
        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // إضافة منتج إلى السلة
    function addToCart(productId, flavor = null) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const cartId = flavor ? `${productId}-${flavor.id}` : `${productId}`;
            const existingItem = cart.find(item => item.cartId === cartId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                // Use flavor-specific price if available
                let itemPrice = product.price;
                let itemImage = product.image;
                if (flavor && product.flavors) {
                    const flavorData = product.flavors.find(f => f.id === flavor.id);
                    if (flavorData && flavorData.price) {
                        itemPrice = flavorData.price;
                    }
                    // Use flavor-specific image if available
                    if (flavor.image && flavor.image !== '') {
                        itemImage = flavor.image;
                    } else if (flavorData && flavorData.image) {
                        itemImage = flavorData.image;
                    }
                }
                cart.push({ ...product, price: itemPrice, image: itemImage, cartId, selectedFlavor: flavor, quantity: 1 });
            }
            updateCartDisplay();

            // Show toast notification with product name
            let displayName = currentLang === 'ar' ? product.name : (product.name_en || product.name);
            if (flavor) {
                const flavorName = currentLang === 'ar' ? flavor.name_ar : flavor.name_en;
                if (flavorName) displayName += ` - ${flavorName}`;
            }
            showToast(displayName);

            // Bounce cart icon
            if (cartIcon) {
                cartIcon.classList.remove('bounce');
                void cartIcon.offsetWidth;
                cartIcon.classList.add('bounce');
                cartIcon.addEventListener('animationend', () => {
                    cartIcon.classList.remove('bounce');
                }, { once: true });
            }
        }
    }

    // تعديل كمية المنتج في السلة
    function updateQuantity(cartId, change) {
        const itemIndex = cart.findIndex(item => (item.cartId || String(item.id)) === String(cartId));
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            updateCartDisplay();
        }
    }

    // إزالة منتج من السلة
    function removeItemFromCart(cartId) {
        cart = cart.filter(item => (item.cartId || String(item.id)) !== String(cartId));
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
        const shipping = 0;

        cart.forEach(item => {
            let name = currentLang === "ar" ? item.name : (item.name_en || item.name);
            if (item.selectedFlavor) {
                const flavorName = currentLang === 'ar' ? item.selectedFlavor.name_ar : item.selectedFlavor.name_en;
                name += ` (${flavorName})`;
            }
            const currency = translations[currentLang]?.currency || 'EGP';

            const div = document.createElement('div');
            div.classList.add('checkout-item');
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
                    <img src="${item.image}" alt="${name}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 8px;">
                    <div class="checkout-item-details" style="flex-grow: 1; margin: 0;">
                        <h4>${name}</h4>
                        <p>${Math.round(item.price)} ${currency}</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="chk-qty-controls">
                        <button type="button" class="chk-decrease" data-id="${item.cartId || item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="chk-increase" data-id="${item.cartId || item.id}">+</button>
                    </div>
                    <button type="button" class="chk-remove-item" data-id="${item.cartId || item.id}" style="background: none; border: none; color: #ff4d4d; font-size: 1.2rem; cursor: pointer; padding: 5px;" title="حذف المنتج">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            checkoutItemsList.appendChild(div);
            subtotal += item.price * item.quantity;
        });

        checkoutSubtotal.textContent = Math.round(subtotal);
        const shippingEl = document.getElementById('checkoutShipping');
        if (shippingEl) shippingEl.textContent = Math.round(shipping);
        checkoutFinalTotal.textContent = Math.round(subtotal + shipping);

        const submitBtn = document.querySelector('.place-order-btn');
        if (submitBtn) submitBtn.disabled = false;
    }

    if (checkoutItemsList) {
        checkoutItemsList.addEventListener('click', (e) => {
            const increaseBtn = e.target.closest('.chk-increase');
            const decreaseBtn = e.target.closest('.chk-decrease');
            const removeBtn = e.target.closest('.chk-remove-item');

            if (increaseBtn) {
                updateQuantity(increaseBtn.dataset.id, 1);
                renderCheckoutItems();
            } else if (decreaseBtn) {
                updateQuantity(decreaseBtn.dataset.id, -1);
                renderCheckoutItems();
            } else if (removeBtn) {
                removeItemFromCart(removeBtn.dataset.id);
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
                email: email.trim() || (currentLang === 'ar' ? 'غير محدد' : 'Not specified'),
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
            const addBtn = e.target.closest('.add-to-cart-btn');
            if (addBtn) {
                const productId = parseInt(addBtn.dataset.id || addBtn.getAttribute('data-id'));
                const card = e.target.closest('.product-card');
                const activeFlavorBtn = card.querySelector('.flavor-btn.active');
                let flavor = null;
                if (activeFlavorBtn) {
                    flavor = {
                        id: activeFlavorBtn.getAttribute('data-flavor-id'),
                        name_ar: activeFlavorBtn.getAttribute('data-flavor-name-ar'),
                        name_en: activeFlavorBtn.getAttribute('data-flavor-name-en'),
                        image: activeFlavorBtn.getAttribute('data-flavor-image') || ''
                    };
                }
                addToCart(productId, flavor);
            }
        });
    }

    window.selectFlavor = function (btn) {
        const parent = btn.closest('.product-flavors');
        if (parent) {
            // Reset all buttons to outline style with their own color
            parent.querySelectorAll('.flavor-btn').forEach(b => {
                b.classList.remove('active');
                const bColor = b.getAttribute('data-flavor-color') || 'var(--primary-color)';
                b.style.backgroundColor = 'transparent';
                b.style.color = bColor;
                b.style.borderColor = bColor;
            });
            // Set active button to filled style
            btn.classList.add('active');
            const activeColor = btn.getAttribute('data-flavor-color') || 'var(--primary-color)';
            btn.style.backgroundColor = activeColor;
            btn.style.color = '#fff';
            btn.style.borderColor = activeColor;
        }
        // Update displayed price if flavor has its own price
        const flavorPrice = btn.getAttribute('data-flavor-price');
        if (flavorPrice) {
            const card = btn.closest('.product-card');
            if (card) {
                const priceEl = card.querySelector('.product-price');
                if (priceEl) {
                    const currency = translations[currentLang]?.currency || 'جنية';
                    priceEl.textContent = `${Math.round(parseFloat(flavorPrice))} ${currency}`;
                }
            }
        }

        // Update displayed image if flavor has its own image
        const flavorImage = btn.getAttribute('data-flavor-image');
        if (flavorImage && flavorImage !== '') {
            const card = btn.closest('.product-card');
            if (card) {
                const imgEl = card.querySelector('img');
                if (imgEl) {
                    imgEl.style.opacity = '0.5';
                    setTimeout(() => {
                        imgEl.src = flavorImage;
                        imgEl.style.opacity = '1';
                    }, 150);
                }
            }
        }
    };

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const increaseBtn = e.target.closest('.increase-quantity');
            const decreaseBtn = e.target.closest('.decrease-quantity');
            const removeBtn = e.target.closest('.remove-item');

            if (increaseBtn) {
                updateQuantity(increaseBtn.dataset.id, 1);
            } else if (decreaseBtn) {
                updateQuantity(decreaseBtn.dataset.id, -1);
            } else if (removeBtn) {
                removeItemFromCart(removeBtn.dataset.id);
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

    // Footer quick links filtering
    const footerFilterLinks = document.querySelectorAll('.footer-filter-link');
    footerFilterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            currentCategoryFilter = filter;

            // Update active state on main filter options too
            filterOptions.forEach(b => b.classList.remove('active'));
            const matchingOption = document.querySelector(`.filter-option[data-filter="${filter}"]`);
            if (matchingOption) matchingOption.classList.add('active');

            displayProducts();

            // Scroll to products section
            const productsSection = document.getElementById('products');
            if (productsSection) {
                const offset = productsSection.offsetTop - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

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
