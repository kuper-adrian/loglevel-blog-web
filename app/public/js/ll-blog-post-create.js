$(document).ready(() => {
  $('#move-tag-left-btn').on('click', () => {
    const selectedTag = $('#post-tags-select option:selected');
    if (selectedTag.length === 0) {
      return;
    }

    const option = {
      value: selectedTag.val(),
      text: selectedTag.text(),
    };

    $('#available-tags-select').append($('<option>', option));
    selectedTag.remove();
  });

  $('#move-tag-right-btn').on('click', () => {
    const selectedTag = $('#available-tags-select option:selected');
    if (selectedTag.length === 0) {
      return;
    }

    const option = {
      value: selectedTag.val(),
      text: selectedTag.text(),
    };

    $('#post-tags-select').append($('<option>', option));
    selectedTag.remove();
  });

  $('#create-blog-post-form').submit(() => {
    const tags = [];

    $('#post-tags-select option').each((index, element) => {
      const current = $(element);
      tags.push({
        value: current.val(),
        text: current.text(),
      });
    });
    const input = $('<input>')
      .attr('type', 'hidden')
      .attr('name', 'tags')
      .val(JSON.stringify(tags));
    $('#create-blog-post-form').append($(input));
  });
});
