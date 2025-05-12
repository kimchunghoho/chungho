<script>
  const menu = document.getElementById('fullscreenMenu');

  menu.addEventListener('shown.bs.offcanvas', function () {
    document.body.style.overflowY = 'auto';     // 세로 스크롤 허용
    document.body.style.overflowX = 'hidden';   // 가로 스크롤 차단
    document.body.style.paddingRight = '0px';   // 오른쪽 여백 제거
  });

  menu.addEventListener('hidden.bs.offcanvas', function () {
    document.body.style.overflow = '';          // 원래대로
    document.body.style.paddingRight = '';
  });
</script>

<script>
const links = document.querySelectorAll('#fullscreenMenu a');

links.forEach(link => {
link.addEventListener('mouseover', function() {
 // 모든 링크를 비활성화 상태로 설정
 links.forEach(l => l.classList.add('inactive'));

 // 현재 마우스를 올린 링크만 활성화
 link.classList.remove('inactive');
});

link.addEventListener('mouseleave', function() {
 // 마우스를 떼면 모든 링크를 다시 활성화 상태로 설정
 links.forEach(l => l.classList.remove('inactive'));
});
});
</script>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>
  <script type="module">
    import * as THREE from 'three';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // OBJ 모델 로드
    const loader = new OBJLoader();
    loader.load(
      'https://raw.githubusercontent.com/kimchunghoho/chungho/master/3d.obj', // 모델 URL
      function (object) {
        // 모델 크기 설정
        object.scale.set(0.03, 0.03, 0.03);

        // 중심 계산 및 이동
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        // 각 메쉬에 스타일 적용
        object.traverse(child => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0.078, 0, 1),
              transparent: true,
              opacity: 0.3,
              side: THREE.DoubleSide,
              depthWrite: false
            });

            // 외곽선 추가
            const edges = new THREE.EdgesGeometry(child.geometry, 1);
            const line = new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({ color: '#1400ff', linewidth: 1, depthTest: false })
            );
            child.add(line);
          }
        });

        // 회전 그룹에 추가 (이 그룹이 여러 번 추가되지 않도록 함)
        const pivot = new THREE.Group();
        pivot.add(object);
        scene.add(pivot);
        scene.userData.pivot = pivot;
      },
      xhr => console.log((xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded'),
      error => console.error('An error happened', error)
    );


    // 카메라 위치 설정
    camera.position.z = 500;

    // 반응형 대응
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 애니메이션
    function animate() {
      requestAnimationFrame(animate);
      const pivot = scene.userData.pivot;
      if (pivot) {
        pivot.rotation.y += 0.005; // 회전 애니메이션
      }
      renderer.render(scene, camera);
    }

    animate();
  </script>
