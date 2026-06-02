/* ============================================
   科科机器人科技团队 - 交互脚本
   多页面切换 · 轮播图 · 数字动画
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- DOM 引用 ----
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const pageContainer = document.getElementById('pageContainer');
    var _handlingPopState = false;

    // ==================== 页面切换系统 ====================
    function switchPage(pageName, anchorId) {
        // 隐藏所有页面
        var allPages = document.querySelectorAll('.page');
        allPages.forEach(function (p) { p.classList.remove('active'); });

        // 显示目标页面
        var targetPage = document.getElementById('page-' + pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // 更新导航高亮 —— 先清除所有
        var allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(function (link) { link.classList.remove('active'); });

        // 高亮匹配的顶层导航项
        allNavLinks.forEach(function (link) {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // 子页面自动高亮父级下拉触发器
        var subToParent = {
            'about': 'about',
            'team': 'about',
            'team-detail': 'about',
            'news': 'about',
            'news-detail': 'about',
            'products': 'products'
        };
        var parentPage = subToParent[pageName];
        if (parentPage) {
            var triggers = document.querySelectorAll('.nav-dropdown-trigger');
            triggers.forEach(function (t) {
                if (t.getAttribute('data-page') === parentPage) {
                    t.classList.add('active');
                }
            });
        }

        // 关闭移动端菜单
        menuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');

        // 非首页强制显示实色导航栏（首页依赖滚动控制透明/实色切换）
        if (pageName === 'home') {
            navbar.classList.remove('scrolled');
        } else {
            navbar.classList.add('scrolled');
        }

        // 如果切换到首页，重置轮播
        if (pageName === 'home') {
            currentSlide = 0;
            updateCarousel();
            resetAutoPlay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (anchorId) {
            // 等页面切换完成（display:block 生效 + 布局计算完成）后精准定位
            setTimeout(function () {
                var anchorEl = document.getElementById(anchorId);
                if (anchorEl) {
                    var navHeight = navbar.offsetHeight + 20;
                    var rect = anchorEl.getBoundingClientRect();
                    var scrollTarget = window.pageYOffset + rect.top - navHeight;
                    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }

                // 从"咨询定制服务"来时，预选"定制解决方案"
                if (anchorId === 'contactFormAnchor') {
                    var interestSelect = document.getElementById('interest');
                    if (interestSelect) {
                        interestSelect.value = 'custom';
                    }
                }
            }, 300);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 更新浏览器历史记录（popstate 回调时不重复 push）
        if (!_handlingPopState) {
            var state = { pageName: pageName, anchorId: anchorId || null };
            history.pushState(state, '', '#' + pageName);
        }
        _handlingPopState = false;
    }

    // ==================== 浏览器前进/后退支持 ====================
    window.addEventListener('popstate', function (e) {
        _handlingPopState = true;
        if (e.state && e.state.pageName) {
            switchPage(e.state.pageName, e.state.anchorId);
            if (e.state.memberId) {
                showTeamDetail(e.state.memberId);
            } else if (e.state.newsIndex !== undefined) {
                showNewsDetail(e.state.newsIndex);
            }
        } else {
            // 无历史记录时回到首页
            switchPage('home');
        }
    });

    // 初始加载时根据 URL hash 路由到对应页面
    (function initHashRoute() {
        var hash = window.location.hash;
        if (hash && hash.length > 1) {
            var hashContent = hash.substring(1);
            if (hashContent.indexOf('team-detail/') === 0) {
                var memberId = hashContent.split('/')[1];
                if (memberId) {
                    _handlingPopState = true;
                    switchPage('team-detail');
                    showTeamDetail(memberId);
                    var detailState = { pageName: 'team-detail', memberId: memberId };
                    history.replaceState(detailState, '', '#' + hashContent);
                }
            } else if (hashContent.indexOf('news-detail/') === 0) {
                var newsIndex = parseInt(hashContent.split('/')[1], 10);
                if (!isNaN(newsIndex)) {
                    _handlingPopState = true;
                    switchPage('news-detail');
                    showNewsDetail(newsIndex);
                    var detailState = { pageName: 'news-detail', newsIndex: newsIndex };
                    history.replaceState(detailState, '', '#' + hashContent);
                }
            } else {
                _handlingPopState = true;
                switchPage(hashContent);
            }
        } else {
            // 无 hash，设置首页初始状态
            history.replaceState({ pageName: 'home' }, '', '#home');
        }
    })();

    // 绑定所有带 data-page 的导航元素（下拉触发器除外）
    document.querySelectorAll('[data-page]').forEach(function (el) {
        // 跳过下拉触发器，它们有独立的点击处理
        if (el.hasAttribute('data-dropdown')) return;

        el.addEventListener('click', function (e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            const anchorId = this.getAttribute('data-anchor');
            switchPage(pageName, anchorId);
        });
    });

    // ==================== 下拉菜单点击切换（桌面端和触摸设备） ====================
    var dropdownTriggers = document.querySelectorAll('.nav-dropdown-trigger[data-dropdown]');

    dropdownTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 移动端（≤640px）：下拉子项始终可见，触发器直接导航
            if (window.innerWidth <= 640) {
                var pageName = this.getAttribute('data-page');
                var anchorId = this.getAttribute('data-anchor');
                switchPage(pageName, anchorId);
                return;
            }

            var parentLi = this.closest('.nav-dropdown');
            var isOpen = parentLi.classList.contains('dropdown-open');

            // 如果已打开，第二次点击导航到目标页面
            if (isOpen) {
                document.querySelectorAll('.nav-dropdown.dropdown-open').forEach(function (dd) {
                    dd.classList.remove('dropdown-open');
                });
                var pageName = this.getAttribute('data-page');
                var anchorId = this.getAttribute('data-anchor');
                switchPage(pageName, anchorId);
                return;
            }

            // 关闭所有其他下拉
            document.querySelectorAll('.nav-dropdown.dropdown-open').forEach(function (dd) {
                dd.classList.remove('dropdown-open');
            });

            // 打开当前下拉
            parentLi.classList.add('dropdown-open');
        });
    });

    // 点击页面其他区域关闭所有下拉菜单
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown.dropdown-open').forEach(function (dd) {
                dd.classList.remove('dropdown-open');
            });
        }
    });

    // 下拉子项点击后关闭下拉菜单
    document.querySelectorAll('.dropdown-menu a[data-page]').forEach(function (link) {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-dropdown.dropdown-open').forEach(function (dd) {
                dd.classList.remove('dropdown-open');
            });
        });
    });

    // ==================== 导航栏滚动效果 ====================
    function updateNavbar() {
        // 首页才依赖滚动位置切换透明/实色，其他页面始终实色
        var homePage = document.getElementById('page-home');
        var isHome = homePage && homePage.classList.contains('active');
        if (isHome && window.scrollY <= 40) {
            navbar.classList.remove('scrolled');
        } else {
            navbar.classList.add('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // ==================== 移动端菜单 ====================
    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // ==================== 轮播图 ====================
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const totalSlides = carouselDots.length;
    let currentSlide = 0;
    let autoPlayTimer = null;

    function updateCarousel() {
        // 移动轨道
        if (carouselTrack) {
            carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }

        // 更新圆点
        carouselDots.forEach(function (dot, index) {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 圆点点击
    carouselDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            currentSlide = parseInt(this.getAttribute('data-index'));
            updateCarousel();
            resetAutoPlay();
        });
    });

    // 箭头点击
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            prevSlide();
            resetAutoPlay();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            nextSlide();
            resetAutoPlay();
        });
    }

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.getElementById('heroCarousel');

    if (carousel) {
        carousel.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 60) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoPlay();
            }
        });
    }

    // 键盘左右键
    document.addEventListener('keydown', function (e) {
        const homePage = document.getElementById('page-home');
        if (homePage && homePage.classList.contains('active')) {
            if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
            if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
        }
    });

    // 初始启动自动播放
    startAutoPlay();

    // ==================== 滚动渐入动画 ====================
    // 参考宇树科技的渐入效果：从下方淡入 + 缩放回弹
    const fadeElements = document.querySelectorAll(
        '.field-card, .culture-card, .timeline-card, .news-card,' +
        '.product-block, .team-card, .contact-card-info, .section-header'
    );

    const fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(function (el, index) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.96)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
        // 错开动画延迟，营造层次感
        el.style.transitionDelay = (index % 4) * 0.08 + 's';
        fadeObserver.observe(el);
    });

    // ==================== 团队成员渲染 ====================
    // 根据 team/team-data.js 动态渲染卡片，增减人员只需修改 team/ 文件夹
    var gradMap = {
        'grad-edu': 'linear-gradient(135deg, #a78bfa, #6366f1)',
        'grad-industry': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
        'grad-service': 'linear-gradient(135deg, #10b981, #06b6d4)',
        'grad-hero': 'linear-gradient(135deg, #60a5fa, #a78bfa)'
    };

    function renderTeamCards() {
        var grid = document.getElementById('teamGrid');
        if (!grid || typeof teamData === 'undefined') return;

        grid.innerHTML = '';

        teamData.forEach(function (member) {
            var bg = gradMap[member.avatarGradient] || gradMap['grad-hero'];
            var card = document.createElement('div');
            card.className = 'team-card';
            card.setAttribute('data-member-id', member.id);
            card.style.cursor = 'pointer';
            var avatarHTML = member.photo
                ? '<img src="' + member.photo + '" alt="' + member.name + '" style="width:88px;height:88px;border-radius:50%;object-fit:contain;background:#f1f5f9;margin:0 auto;display:block;">'
                : '<span style="background:' + bg + ';">' + member.avatarInitial + '</span>';
            card.innerHTML =
                '<div class="team-avatar-lg">' + avatarHTML + '</div>' +
                '<h3>' + member.name + '</h3>' +
                '<span class="team-title">' + member.title + '</span>' +
                '<p>' + member.shortBio + '</p>' +
                '<div class="team-socials"><span>📧</span><span>💼</span><span>🔬</span></div>';
            grid.appendChild(card);

            // 渐入动画初始状态
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.96)';
            card.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
            card.style.transitionDelay = (teamData.indexOf(member) % 4) * 0.08 + 's';
            fadeObserver.observe(card);
        });
    }

    // 事件委托：点击团队卡片跳转到成员详情页
    var teamGridEl = document.getElementById('teamGrid');
    if (teamGridEl) {
        teamGridEl.addEventListener('click', function (e) {
            var card = e.target.closest('.team-card');
            if (card) {
                var memberId = card.getAttribute('data-member-id');
                if (memberId) {
                    showTeamDetail(memberId);
                }
            }
        });
    }

    // 初始渲染团队卡片
    renderTeamCards();

    function showTeamDetail(memberId) {
        // 在 teamData 中查找成员
        var member = null;
        if (typeof teamData !== 'undefined') {
            for (var i = 0; i < teamData.length; i++) {
                if (teamData[i].id === memberId) {
                    member = teamData[i];
                    break;
                }
            }
        }

        if (!member) return;

        // 切换到详情页
        switchPage('team-detail');

        // 更新 URL 为详情页专有链接
        if (!_handlingPopState) {
            var detailState = { pageName: 'team-detail', memberId: memberId };
            history.replaceState(detailState, '', '#team-detail/' + memberId);
        }
        _handlingPopState = false;

        var container = document.getElementById('teamDetailContent');
        if (!container) return;

        // 确定头像渐变色
        var gradMap = {
            'grad-edu': 'linear-gradient(135deg, #a78bfa, #6366f1)',
            'grad-industry': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            'grad-service': 'linear-gradient(135deg, #10b981, #06b6d4)',
            'grad-hero': 'linear-gradient(135deg, #60a5fa, #a78bfa)'
        };
        var avatarGrad = gradMap[member.avatarGradient] || gradMap['grad-hero'];

        // 头像：有照片用 img，没有用渐变+文字
        var avatarHTML = member.photo
            ? '<img src="' + member.photo + '" alt="' + member.name + '" style="width:100px;height:100px;border-radius:50%;object-fit:contain;background:#f1f5f9;margin:0 auto;display:block;">'
            : '<span style="background:' + avatarGrad + ';">' + member.avatarInitial + '</span>';

        // 渲染头部 + 加载中
        container.innerHTML =
            '<div class="team-detail-header">' +
                '<div class="team-detail-avatar">' + avatarHTML + '</div>' +
                '<h1 class="team-detail-name">' + member.name + '</h1>' +
                '<span class="team-detail-title">' + member.title + '</span>' +
                '<p class="team-detail-bio">' + member.shortBio + '</p>' +
            '</div>' +
            '<div class="team-detail-body" id="teamDetailBody">⏳ 加载中…</div>';

        // 渲染正文
        function renderBody(sections) {
            var body = document.getElementById('teamDetailBody');
            if (!body) return;
            body.innerHTML = sections.map(function (s) {
                return '<div class="team-detail-section">' +
                    '<h3>' + s.heading + '</h3>' +
                    '<p>' + s.content + '</p>' +
                '</div>';
            }).join('');
        }

        if (member.folder) {
            fetch(member.folder + '/content.json')
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    renderBody(data.sections || []);
                })
                .catch(function () {
                    renderBody([{ heading: '提示', content: '正文加载失败，请检查 ' + member.folder + '/content.json 是否存在' }]);
                });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==================== 新闻动态渲染 ====================
    // 新闻数据在 news/news-data.js 中，添加新闻请编辑那个文件

    var NEWS_PER_PAGE = 5;  // 每次显示几条
    var newsShownCount = 0;

    function renderNews(startIndex, count) {
        var grid = document.getElementById('newsGrid');
        if (!grid) return;

        var endIndex = Math.min(startIndex + count, newsData.length);
        for (var i = startIndex; i < endIndex; i++) {
            var n = newsData[i];
            var isFirst = (i === 0);  // 首条置顶跨列

            var article = document.createElement('article');
            article.className = 'news-card' + (isFirst ? ' news-featured' : '');

            // 封面：有图片用图片，没有用 emoji
            var coverHTML = n.img
                ? '<img class="news-img-cover" src="' + n.img + '" alt="' + n.title + '" loading="lazy">'
                : '<div class="news-img-placeholder">' + (n.icon || '📰') + '</div>';

            // 阅读全文链接：优先用 link 外链，否则跳到内置详情页
            var linkHTML = '';
            if (n.link) {
                linkHTML = '<a href="' + n.link + '" target="_blank" rel="noopener" class="news-link">阅读全文 →</a>';
            } else if (n.folder || n.content) {
                article.setAttribute('data-news-index', i);
                linkHTML = '<span class="news-link news-link-click" data-news-index="' + i + '">阅读全文 →</span>';
            }

            article.innerHTML =
                coverHTML +
                '<div class="news-body">' +
                    '<span class="news-date">' + n.date + '</span>' +
                    '<span class="news-tag">' + n.tag + '</span>' +
                    '<h3>' + n.title + '</h3>' +
                    '<p>' + n.desc + '</p>' +
                    linkHTML +
                '</div>';

            grid.appendChild(article);
        }

        // 绑定"阅读全文"点击事件（委托在 grid 上）
        bindNewsDetailClicks();

        newsShownCount = endIndex;

        // 隐藏"加载更多"按钮
        var moreBtn = document.getElementById('loadMoreNews');
        var moreWrap = document.getElementById('newsMore');
        if (moreWrap && newsShownCount >= newsData.length) {
            moreWrap.style.display = 'none';
        }
    }

    // 委托绑定：点击"阅读全文"跳到详情页
    function bindNewsDetailClicks() {
        var grid = document.getElementById('newsGrid');
        if (!grid) return;
        // 用事件委托，避免重复绑定
        grid.addEventListener('click', function (e) {
            var target = e.target;
            if (target.classList.contains('news-link-click')) {
                var index = parseInt(target.getAttribute('data-news-index'), 10);
                if (!isNaN(index)) {
                    showNewsDetail(index);
                }
            }
        });
    }

    // 显示内置新闻详情页
    function showNewsDetail(index) {
        var n = newsData[index];
        if (!n) return;

        // 切换到详情页
        switchPage('news-detail');

        // 更新 URL 为详情页专有链接
        if (!_handlingPopState) {
            var detailState = { pageName: 'news-detail', newsIndex: index };
            history.replaceState(detailState, '', '#news-detail/' + index);
        }
        _handlingPopState = false;

        var container = document.getElementById('newsDetailContent');
        if (!container) return;

        // 显示加载中 + 头部
        container.innerHTML =
            '<div class="news-detail-header">' +
                '<span class="news-date">' + n.date + '</span>' +
                '<span class="news-tag">' + n.tag + '</span>' +
                '<h1 class="news-detail-title">' + n.title + '</h1>' +
            '</div>' +
            (n.img
                ? '<img class="news-detail-cover" src="' + n.img + '" alt="' + n.title + '">'
                : ''
            ) +
            '<div class="news-detail-body" id="newsDetailBody">⏳ 加载中…</div>';

        // 加载正文内容
        function renderBody(paragraphs) {
            var body = document.getElementById('newsDetailBody');
            if (!body) return;
            body.innerHTML = paragraphs.map(function (p) {
                return '<p>' + p + '</p>';
            }).join('');
        }

        if (n.folder) {
            // 从文件夹 fetch content.json
            fetch(n.folder + '/content.json')
                .then(function (res) { return res.json(); })
                .then(function (data) { renderBody(data.paragraphs); })
                .catch(function () {
                    renderBody(['（正文加载失败，请检查 ' + n.folder + '/content.json 是否存在）']);
                });
        } else if (n.content) {
            // 兼容旧格式：内联 content 数组
            renderBody(n.content);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 初始渲染
    renderNews(0, NEWS_PER_PAGE);

    // ==================== 加载更多新闻 ====================
    var loadMoreNewsBtn = document.getElementById('loadMoreNews');
    if (loadMoreNewsBtn) {
        loadMoreNewsBtn.addEventListener('click', function () {
            renderNews(newsShownCount, NEWS_PER_PAGE);
        });
    }

    // ==================== 联系表单提交 ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 简单反垃圾：检查隐藏 checkbox
            var botcheck = contactForm.querySelector('[name="botcheck"]');
            if (botcheck && botcheck.checked) {
                alert('提交失败，请重试。');
                return;
            }

            var btn = contactForm.querySelector('button[type="submit"]');
            var originalText = btn.textContent;

            btn.textContent = '⏳ 发送中…';
            btn.disabled = true;

            // 收集表单数据
            var formData = new FormData(contactForm);
            // 拼接关注方向到留言
            var interest = formData.get('interest');
            var message = formData.get('message');
            if (interest) {
                var interestMap = {
                    'edu': '教育机器人',
                    'industry': '工业机器人',
                    'service': '服务机器人',
                    'custom': '定制解决方案',
                    'other': '其他合作'
                };
                formData.set('message', '[关注方向：' + (interestMap[interest] || interest) + ']\n' + message);
            }

            // 发送到 Web3Forms
            fetch(contactForm.action, {
                method: 'POST',
                body: formData
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    btn.textContent = '✓ 发送成功！我们将在24小时内回复';
                    btn.style.background = '#10b981';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || '发送失败');
                }
            })
            .catch(function (error) {
                btn.textContent = '✗ ' + (error.message || '网络错误，请稍后重试');
                btn.style.background = '#ef4444';
            })
            .finally(function () {
                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            });
        });
    }

});
