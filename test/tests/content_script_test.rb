require 'test_helper'

class ContentScriptTest < CapybaraTestCase
  def setup
    super
    @all_elements = %w(#div1 #div2 #div3 input body)
    @test_url     = "file://#{Dir.pwd}/test/test.html"
  end

  def change_font(up = true)
    key = up ? '=' : '-'
    page.execute_script("Mousetrap.trigger('alt+#{key}')")
  end

  def verify_font_size(size, notification = true)
    @all_elements.each do |element|
      assert_equal "#{size}px", get_js("$('#{element}').css('font-size')"), element
      if element == 'input'
        assert_equal "12px", get_js("$('#{element}').css('line-height')")
      else
        assert_equal "#{size}px", get_js("$('#{element}').css('line-height')")
      end
      assert_equal('all 0s ease 0s', get_js("$('#{element}').css('transition')"))
    end
    assert_equal '10px', get_js("$('#no_text').css('line-height')")

    verify_gritter_text(notification ? "#{size * 10}%" : notification)
  end

  def verify_no_style(selector)
    style = get_js("$('#{selector}').attr('style')")
    assert ['', nil, 'zoom: 1;'].include?(style)
    assert_equal false, has_class?(find(selector), 'noTransition')
  end

  def verify_gritter_text(text)
    if text
      assert all('.gritter-without-image p').last.text.include?(text)
    else
      assert_equal false, page.has_css?('.gritter-item')
    end
  end

  def verify_all_no_style(notification = true)
    @all_elements.each do |element|
      verify_no_style element
    end
    verify_gritter_text(notification ? '100%' : notification)
  end

  def test_zoom
    visit @test_url

    change_font
    verify_font_size 11
    change_font
    verify_font_size 12

    visit @test_url
    # make sure font increase is saved
    verify_font_size 12, false

    change_font false
    verify_font_size 11
    change_font false
    verify_all_no_style

    visit @test_url
    verify_all_no_style false

    change_font false
    verify_font_size 9
  end
end