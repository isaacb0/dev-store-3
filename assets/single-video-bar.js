class SingleVideoBarSlider {
  constructor(id) {
    this.cardRow = document.getElementById(id);
    this.videoSlider = this.cardRow.querySelector('.single-video-slider');
    this.cardVideos = this.cardRow.querySelectorAll('.single-card-video');
    this.cardImage = this.cardRow.querySelector('.single-card-image-wide');
    this.chevLeft = this.cardRow.querySelector('.single-chevron.left');
    this.chevRight = this.cardRow.querySelector('.single-chevron.right');

    this.videoModal = document.getElementById('videoModal');
    this.videoIframe = document.getElementById('videoIframe');
    this.closeModal = document.querySelector('.close');
    this.prevVideo = document.getElementById('prevVideo');
    this.nextVideo = document.getElementById('nextVideo');

    this.currentVideoIndex = 0;
    this.coversToScroll = 3;

    this.initSlider();
    window.addEventListener('resize', this.initSlider.bind(this), false);
  }

   initSlider = () => {
    const numberOfCoversToShow = this.getNumberOfCoversToShow();
    this.setCardRowWidth(numberOfCoversToShow);
    this.updateButtonVisibility();
    this.addSliderEventListeners();
    this.chevLeft.style.height = `${this.cardImage.offsetHeight}px`;
    this.chevRight.style.height = `${this.cardImage.offsetHeight}px`;
    // this.addModalEventListeners();
  }

  getNumberOfCoversToShow = () => {
    if (window.innerWidth <= 768) {
      return 2.5; // Show 3 covers on mobile
    } else {
      return 4.5; // Show 4 covers on desktop
    }
  }

  addSliderEventListeners = () => {
    this.chevLeft.addEventListener('click', () => {
      this.scrollCovers(-1);
      setTimeout(this.updateButtonVisibility, 200);
    });
    this.chevRight.addEventListener('click', () => {
      this.scrollCovers(1);
      setTimeout(this.updateButtonVisibility, 200);
    });
    this.videoSlider.addEventListener('scroll', this.updateButtonVisibility);
    window.addEventListener('resize', this.updateButtonVisibility);

    window.addEventListener('resize', () => {
      const numberOfCoversToShow = this.getNumberOfCoversToShow();
      this.setCardRowWidth(numberOfCoversToShow);
      this.updateButtonVisibility();
    });

    this.cardVideos.forEach((cover, index) => {
      cover.addEventListener('click', () => {
        // const videoId = cover.dataset.videoId;
        // videoModal.style.display = 'flex';
        this.adjustVideoAspectRatio();
        this.currentVideoIndex = index;
      });
    });
  }

  addModalEventListeners = () => {
    this.closeModal.addEventListener('click', () => {
      videoModal.style.display = 'none';
      videoIframe.src = '';
    });

    window.addEventListener('click', (event) => {
      if (event.target === videoModal) {
        videoModal.style.display = 'none';
        videoIframe.src = '';
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && videoModal.style.display === 'flex') {
        videoModal.style.display = 'none';
        videoIframe.src = '';
      }
    });

    window.addEventListener('resize', () => {
      if (videoModal.style.display === 'flex') {
        this.adjustVideoAspectRatio();
      }
    });

    this.prevVideo.addEventListener('click', this.prevVideoHandler.bind(this));
    this.nextVideo.addEventListener('click', this.nextVideoHandler.bind(this));
  }

  setCardRowWidth = (numberOfCoversToShow) => {
    const coverWidth =
      (this.cardRow.clientWidth - (numberOfCoversToShow - 1) * 16) /
      numberOfCoversToShow;
    this.cardVideos.forEach((cover) => {
      cover.style.width = `${coverWidth}px`;
    });
  }

  scrollCovers = (direction) => {
    const coverWidth = parseFloat(this.cardVideos[0].style.width);
    this.videoSlider.scrollBy({
      left: direction * this.coversToScroll * (coverWidth + 16),
      behavior: 'smooth',
    });
  }

  updateButtonVisibility = () => {
    this.chevLeft.style.visibility =
      this.videoSlider.scrollLeft > 0 ? 'visible' : 'hidden';
    this.chevRight.style.visibility =
      this.videoSlider.scrollLeft + this.videoSlider.clientWidth <
      this.videoSlider.scrollWidth
        ? 'visible'
        : 'hidden';
  }

  changeVideo = (index) => {
    const newIndex = (this.cardVideos.length + index) % this.cardVideos.length;
    const newCover = this.cardVideos[newIndex];
    const videoId = newCover.dataset.videoId;
    videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    this.currentVideoIndex = newIndex;
  }

  prevVideoHandler = () => {
    this.changeVideo(this.currentVideoIndex - 1);
  }

  nextVideoHandler = () => {
    this.changeVideo(this.currentVideoIndex + 1);
  }
}
