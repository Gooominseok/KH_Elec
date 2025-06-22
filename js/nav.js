document.addEventListener('DOMContentLoaded', () => {
    // 스크롤 시 투명 네비게이션 삭제 후 네비게이션 재생성
    const navbar = document.getElementById("mainNav");

    window.addEventListener('scroll', () => {
        if (window.scrollY <= 20) {
            navbar.classList.remove('scroll');
        } else {
            navbar.classList.add('scroll');
        }
    });

    // 토글 클릭 시 메뉴 활성화
    const navToggle = document.getElementById('navToggle');
    const navLink = document.getElementById('navLink');
    const navItems = document.querySelectorAll('.nav-item');

    navToggle.addEventListener('click', () => {
        navLink.classList.toggle('show');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLink.classList.remove('show');
        });
    });

    //네비게이션 기능 사용자 지정
    navItems.forEach(link => {
        //기본 동작 방지
        link.addEventListener('click', function (e) {
            e.preventDefault();

            //target으로 하는 id 가져와서 해당 id를 가지고 있는 녀석 targetEl에 저장
            const targetId = this.dataset.target;
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                //90px 위로
                const scrollPos = -90;
                const scroll = targetEl.getBoundingClientRect().top + window.pageYOffset + scrollPos;

                window.scrollTo({
                    top: scroll,
                    behavior: 'smooth'
                });
            }
        });
    });

    //전화 연결
    document.querySelectorAll('.call-link').forEach(el => {
        el.addEventListener('click', function () {
          window.location.href = 'tel:01037073277';
        });
      });
});