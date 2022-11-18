<script setup>
import SearchTab from './components/SearchTab.vue'
import TabHeader from './components/TabHeader.vue'
</script>

<template>
<div class="page">
    <div class="row" id="main-content">
      <div class="splitter">
          <div class="comp-column">
              <div data-tabs class="tabs" id="main-tab">
                  <TabHeader active="true" link="#simplesearch" icon="fa-magnifying-glass" />
                  <TabHeader link="#queue-list" icon="fa-list" />
                  <TabHeader link="#recent-list" icon="fa-history" />
              </div>
              <div class="tabs-container" data-tabs-content="main-tab">
                <SearchTab />
                  <div class="tabs-panel" id="queue-list">
                      <div class="vsplit">
                          <div id="queue-list-wrapper" class="results">
                              <ul id="queue" class="vertical menu">
                                  <li rv-if="queue.current" id="current">
                                      {% if admin == True -%}
                                      <div class="row">
                                          <div class="columns small-9">
                                              {%- endif %}
                                              <div class="row">
                                                  <span class="artist">{ queue.current.artist }</span>
                                                  <span class="title">{ queue.current.title }</span>
                                                  <span class="album">{ queue.current.album }</span>
                                              </div>
                                              <div class="row">
                                                  <span class="singer">{ queue.current.performer }</span>
                                              </div>
                                              {% if admin == True -%}
                                          </div>
                                          <div class="columns small-3">
                                              <div class="button-group">
                                                  <button class="button alert fright" rv-on-click="queue.abort"><i class="fa fa-step-forward"></i></button>
                                                  <button class="button alert fright" rv-on-click="queue.kill"><i class="fa fa-times"></i></button>
                                              </div>
                                          </div>
                                      </div>
                                      {%- endif %}

                                  </li>
                                  <li rv-each-entry="queue.queue">
                                      {% if admin == True -%}
                                      <div class="row">
                                          <div class="columns small-9">
                                              {%- endif %}
                                              <div class="row">
                                                  <span class="artist">{ entry.artist }</span>
                                                  <span class="title">{ entry.title }</span>
                                                  <span class="album">{ entry.album }</span>
                                              </div>
                                              <div class="row">
                                                  <span class="singer">{ entry.performer }</span>
                                                  <span class="eta">{ entry.etamin }</span>
                                              </div>
                                              {% if admin == True -%}
                                          </div>
                                          <div class="columns small-3">
                                              <button class="button alert fright" rv-on-click="queue.deleteFromQueue"><i class="fa fa-minus"></i></button>
                                          </div>
                                      </div>
                                      {%- endif %}
                                  </li>
                              {% if admin == True %}
                                  <li>
                                      <div class="row">
                                          <div class="columns small-12">
                                                  <a class="button" download="queue.json" rv-href="queue.data">Save</a>
                                                  <label for="small-bulk-upload" class="button bulk-upload-label">Bulk Append</label>
                                                  <input type="file" id="small-bulk-upload" rv-on-change="queue.bulk_append" class="show-for-sr">
                                          </div>
                                      </div>
                                  </li>
                              {% endif %}
                              </ul>
                          </div>
                      </div>
                  </div>
                  <div class="tabs-panel" id="recent-list">
                      <div class="vsplit">
                          <div id="recent-list-wrapper" class="results">
                              <ol id="last10" class="vertical menu">
                                  <li rv-each-entry="queue.last10">
                                      <div class="row">
                                          <span class="artist">{ entry.artist }</span>
                                          <span class="title">{ entry.title }</span>
                                          <span class="album">{ entry.album }</span>
                                      </div>
                                      <div class="row">
                                          <span class="singer">{ entry.performer }</span>
                                      </div>
                                  </li>
                              </ol>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
    background: url(../syng.png) fixed;
    background-color: #8a8a8a;
    background-size: auto 50%;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
